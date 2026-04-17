import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import Loading from "../Loading/Loading";
import Product from "../Product/Product";
import { baseUrl } from "./../../utils/baseUrl";
import "./Products.css";

export default function Products({ homeMode = false }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = homeMode ? "" : searchParams.get("search") || "";
  const [isLoading, setIsLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(homeMode ? "" : searchParams.get("subcategory") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [apiError, setApiError] = useState("");
  const [subcategoryContext, setSubcategoryContext] = useState({
    category: null,
    selectedSubcategory: null,
    subcategories: [],
  });

  async function loadShopData() {
    setIsLoading(true);
    setApiError("");
    try {
      const productLimit = homeMode ? 40 : 50;
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        axios.get(`${baseUrl}/products?limit=${productLimit}`),
        axios.get(`${baseUrl}/categories`),
        axios.get(`${baseUrl}/brands`),
      ]);

      setProductList(productsRes?.data?.data || []);
      setCategories(categoriesRes?.data?.data || []);
      setBrands(brandsRes?.data?.data || []);
    } catch (err) {
      setApiError("We couldn't load products right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadShopData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeMode]);

  useEffect(() => {
    if (!homeMode) {
      setSearchValue(searchParams.get("search") || "");
      setSelectedSubcategory(searchParams.get("subcategory") || "");
    }
  }, [homeMode, searchParams]);

  useEffect(() => {
    let isMounted = true;

    async function loadSubcategoryContext() {
      if (homeMode || !selectedSubcategory || categories.length === 0) {
        setSubcategoryContext({
          category: null,
          selectedSubcategory: null,
          subcategories: [],
        });
        return;
      }

      try {
        const subcategoryGroups = await Promise.all(
          categories.map(async (category) => {
            try {
              const res = await axios.get(`${baseUrl}/categories/${category._id}/subcategories`);
              return {
                category,
                subcategories: res?.data?.data || [],
              };
            } catch (err) {
              return {
                category,
                subcategories: [],
              };
            }
          })
        );

        if (!isMounted) return;

        const matchedGroup = subcategoryGroups.find((group) =>
          group.subcategories.some((item) => item._id === selectedSubcategory)
        );
        const matchedSubcategory = matchedGroup?.subcategories.find((item) => item._id === selectedSubcategory) || null;

        setSubcategoryContext({
          category: matchedGroup?.category || null,
          selectedSubcategory: matchedSubcategory,
          subcategories: matchedGroup?.subcategories || [],
        });
      } catch (err) {
        if (isMounted) {
          setSubcategoryContext({
            category: null,
            selectedSubcategory: null,
            subcategories: [],
          });
        }
      }
    }

    loadSubcategoryContext();

    return () => {
      isMounted = false;
    };
  }, [categories, homeMode, selectedSubcategory]);

  function updateSearch(value) {
    setSearchValue(value);
    if (!homeMode) {
      const nextParams = {};
      if (value.trim()) nextParams.search = value.trim();
      setSearchParams(nextParams);
    }
  }

  function toggleValue(value, selected, setter) {
    setter(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  }

  function clearFilters() {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedSubcategory("");
    setMinPrice("");
    setMaxPrice("");
    updateSearch("");
  }

  const filteredProducts = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Infinity;

    const nextProducts = productList.filter((item) => {
      const matchesSearch =
        !query ||
        item.title?.toLowerCase().includes(query) ||
        item.category?.name?.toLowerCase().includes(query) ||
        item.brand?.name?.toLowerCase().includes(query);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category?._id);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(item.brand?._id);
      const matchesSubcategory =
        !selectedSubcategory ||
        item.subcategory?.some((subcategory) => subcategory?._id === selectedSubcategory || subcategory === selectedSubcategory);
      const price = item.priceAfterDiscount || item.price || 0;
      const matchesPrice = price >= min && price <= max;

      return matchesSearch && matchesCategory && matchesBrand && matchesSubcategory && matchesPrice;
    });

    return [...nextProducts].sort((a, b) => {
      if (sortBy === "price-low") return (a.priceAfterDiscount || a.price) - (b.priceAfterDiscount || b.price);
      if (sortBy === "price-high") return (b.priceAfterDiscount || b.price) - (a.priceAfterDiscount || a.price);
      if (sortBy === "rating") return (b.ratingsAverage || 0) - (a.ratingsAverage || 0);
      return 0;
    });
  }, [maxPrice, minPrice, productList, searchValue, selectedBrands, selectedCategories, selectedSubcategory, sortBy]);

  const isSearchPage = !homeMode;
  const hasActiveSearchOrFilters = Boolean(
    searchValue.trim() ||
      selectedCategories.length ||
      selectedBrands.length ||
      selectedSubcategory ||
      minPrice ||
      maxPrice
  );
  const selectedSubcategoryName = subcategoryContext.selectedSubcategory?.name || "Selected Subcategory";
  const selectedCategoryName = subcategoryContext.category?.name || "Category";

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{isSearchPage ? "FreshCart-Search Results" : "FreshCart-Products"}</title>
        <meta name="keywords" content="FreshCart-App-Ecommerce-Products" />
      </Helmet>

      {!homeMode && !hasActiveSearchOrFilters && (
        <section className="fresh-products-hero">
          <div className="container">
            <p>home <span>/</span> All Products</p>
            <div className="fresh-products-hero-content">
              <span><i className="fa-solid fa-box-open"></i></span>
              <div>
                <h1>All Products</h1>
                <h2>Explore our complete product collection</h2>
              </div>
            </div>
          </div>
        </section>
      )}

      {!homeMode && selectedSubcategory && (
        <CategoryHero
          category={subcategoryContext.category}
          title={selectedSubcategoryName}
          subtitle={`Browse ${selectedSubcategoryName} products`}
          breadcrumb={`Home / Categories / ${selectedCategoryName}`}
        />
      )}

      <div className={homeMode ? "fresh-section fresh-products-section" : hasActiveSearchOrFilters ? "fresh-search-page" : "fresh-products-page"}>
        <div className="container">
          {homeMode ? (
            <div className="fresh-section-heading">
              <h2>Featured <span>Products</span></h2>
            </div>
          ) : hasActiveSearchOrFilters && !selectedSubcategory ? (
            <SearchHeading
              searchValue={searchValue}
              resultCount={filteredProducts.length}
              updateSearch={updateSearch}
            />
          ) : selectedSubcategory ? (
            <ActiveFilterBar
              filterLabel={selectedSubcategoryName}
              resultCount={filteredProducts.length}
              clearFilters={clearFilters}
            />
          ) : (
            <h2 className="fresh-showing-count">showing {filteredProducts.length} products</h2>
          )}

          {isLoading ? (
            <Loading />
          ) : apiError ? (
            <div className="fresh-api-error">{apiError}</div>
          ) : homeMode ? (
            <ProductGrid products={filteredProducts} />
          ) : !hasActiveSearchOrFilters ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <ShopSearchLayout
              products={filteredProducts}
              categories={categories}
              brands={brands}
              searchValue={searchValue}
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              selectedSubcategory={selectedSubcategory}
              selectedSubcategoryName={selectedSubcategoryName}
              subcategoryContext={subcategoryContext}
              minPrice={minPrice}
              maxPrice={maxPrice}
              sortBy={sortBy}
              setSortBy={setSortBy}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              toggleCategory={(id) => toggleValue(id, selectedCategories, setSelectedCategories)}
              toggleBrand={(id) => toggleValue(id, selectedBrands, setSelectedBrands)}
              clearFilters={clearFilters}
            />
          )}
        </div>
      </div>
    </>
  );
}

function CategoryHero({ category, title, subtitle, breadcrumb }) {
  return (
    <section className="fresh-page-hero green">
      <div className="container">
        <span>{breadcrumb}</span>
        <div className="fresh-page-hero-title">
          <strong>
            <i className="fa-solid fa-folder-open"></i>
          </strong>
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActiveFilterBar({ filterLabel, resultCount, clearFilters }) {
  return (
    <div className="fresh-subcategory-filter-bar">
      <div>
        <i className="fa-solid fa-filter"></i>
        <span>Active Filters:</span>
        <strong>
          <i className="fa-solid fa-folder-open"></i>
          {filterLabel}
        </strong>
        <button type="button" onClick={clearFilters}>Clear all</button>
      </div>
      <p>Showing {resultCount} {resultCount === 1 ? "product" : "products"}</p>
    </div>
  );
}

function SearchHeading({ searchValue, resultCount, updateSearch }) {
  return (
    <section className="fresh-search-heading">
      <p>Home <span>/</span> Search Results</p>
      <div className="fresh-search-input-large">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input
          placeholder="Search for products..."
          value={searchValue}
          onChange={(e) => updateSearch(e.target.value)}
          autoFocus
        />
      </div>
      {searchValue ? (
        <>
          <h1>Search Results for "{searchValue}"</h1>
          <small>We found {resultCount} products for you</small>
        </>
      ) : (
        <>
          <h1>All Products</h1>
          <small>Browse fresh products and favorite brands</small>
        </>
      )}
    </section>
  );
}

function ProductGrid({ products }) {
  return (
    <div className="fresh-products-grid">
      {products?.map((item) => <Product key={item._id} item={item} homeMode />)}
    </div>
  );
}

function ShopSearchLayout({
  products,
  categories,
  brands,
  searchValue,
  selectedCategories,
  selectedBrands,
  selectedSubcategory,
  selectedSubcategoryName,
  subcategoryContext,
  minPrice,
  maxPrice,
  sortBy,
  setSortBy,
  setMinPrice,
  setMaxPrice,
  toggleCategory,
  toggleBrand,
  clearFilters,
}) {
  const hasActiveFilters = Boolean(searchValue || selectedCategories.length || selectedBrands.length || selectedSubcategory || minPrice || maxPrice);

  return (
    <div className={selectedSubcategory ? "fresh-search-layout no-sidebar" : "fresh-search-layout"}>
      {!selectedSubcategory && (
        <aside className="fresh-filter-panel">
          <h4>Categories</h4>
          <div className="fresh-filter-scroll">
            {categories.map((item) => (
              <label key={item._id}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(item._id)}
                  onChange={() => toggleCategory(item._id)}
                />
                {item.name}
              </label>
            ))}
          </div>

          <h4>Price Range</h4>
          <div className="fresh-price-inputs">
            <input placeholder="Min (EGP)" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            <input placeholder="Max (EGP)" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </div>
          <div className="fresh-price-tags">
            <button type="button" onClick={() => { setMinPrice(""); setMaxPrice("500"); }}>Under 500</button>
            <button type="button" onClick={() => { setMinPrice(""); setMaxPrice("1000"); }}>Under 1K</button>
            <button type="button" onClick={() => { setMinPrice(""); setMaxPrice("5000"); }}>Under 5K</button>
            <button type="button" onClick={() => { setMinPrice(""); setMaxPrice("10000"); }}>Under 10K</button>
          </div>

          <h4>Brands</h4>
          <div className="fresh-filter-scroll">
            {brands.map((item) => (
              <label key={item._id}>
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(item._id)}
                  onChange={() => toggleBrand(item._id)}
                />
                {item.name}
              </label>
            ))}
          </div>
          <button type="button" className="fresh-clear-all" onClick={clearFilters}>Clear All Filters</button>
        </aside>
      )}

      <div className="fresh-search-results">
        {!selectedSubcategory && (
          <div className="fresh-result-controls">
            <div className="fresh-view-buttons">
              <button className="active" type="button"><i className="fa-solid fa-table-cells"></i></button>
              <button type="button"><i className="fa-solid fa-list"></i></button>
            </div>
            {hasActiveFilters && (
              <div className="fresh-active-filter">
                <i className="fa-solid fa-filter"></i>
                Active:
                {searchValue && <span>"{searchValue}"</span>}
                <button type="button" onClick={clearFilters}>Clear all</button>
              </div>
            )}
            <label>
              Sort by:
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </label>
          </div>
        )}

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="fresh-no-products">
            <span><i className="fa-solid fa-box-open"></i></span>
            <h2>No Products Found</h2>
            <p>No products match your current filters.</p>
            <button className="btn" type="button" onClick={clearFilters}>View All Products</button>
          </div>
        )}
      </div>
    </div>
  );
}

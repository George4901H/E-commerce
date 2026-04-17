import React from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function ProfilePage() {
  const { tab = "settings" } = useParams();
  const [addressModalOpen, setAddressModalOpen] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState(null);
  const [addresses, setAddresses] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("freshAddresses") || "[]");
    } catch {
      return [];
    }
  });
  const userName = localStorage.getItem("userName") || "Usama";
  const isAddresses = tab === "addresses";
  const saveAddresses = (nextAddresses) => {
    setAddresses(nextAddresses);
    localStorage.setItem("freshAddresses", JSON.stringify(nextAddresses));
  };
  const addAddress = (address) => {
    saveAddresses([...addresses, { ...address, id: Date.now().toString() }]);
    setAddressModalOpen(false);
  };
  const updateAddress = (address) => {
    saveAddresses(addresses.map((item) => (item.id === address.id ? address : item)));
    setEditingAddress(null);
    setAddressModalOpen(false);
  };
  const openAddAddress = () => {
    setEditingAddress(null);
    setAddressModalOpen(true);
  };
  const openEditAddress = (address) => {
    setEditingAddress(address);
    setAddressModalOpen(true);
  };
  const deleteAddress = (addressId) => {
    saveAddresses(addresses.filter((address) => address.id !== addressId));
  };

  return (
    <>
      <Helmet>
        <title>FreshCart-My Account</title>
      </Helmet>
      <section className="fresh-page-hero green account">
        <div className="container">
          <span>Home / My Account</span>
          <h1><i className="fa-solid fa-user me-3"></i>My Account</h1>
          <p>Manage your addresses and account settings</p>
        </div>
      </section>

      <main className="fresh-page-body fresh-account-page">
        <div className="container">
          <div className="fresh-account-layout">
            <aside className="fresh-account-sidebar">
              <h3>My Account</h3>
              <Link className={isAddresses ? "active" : ""} to="/account/addresses"><i className="fa-solid fa-location-dot"></i> My Addresses <span>›</span></Link>
              <Link className={!isAddresses ? "active" : ""} to="/account/settings"><i className="fa-solid fa-gear"></i> Settings <span>›</span></Link>
            </aside>

            {isAddresses ? (
              <Addresses
                addresses={addresses}
                onAdd={openAddAddress}
                onEdit={openEditAddress}
                onDelete={deleteAddress}
              />
            ) : (
              <Settings userName={userName} />
            )}
          </div>
        </div>
      </main>
      {addressModalOpen && (
        <AddressModal
          address={editingAddress}
          onClose={() => {
            setEditingAddress(null);
            setAddressModalOpen(false);
          }}
          onSave={editingAddress ? updateAddress : addAddress}
        />
      )}
    </>
  );
}

function Settings({ userName }) {
  return (
    <section className="fresh-account-content">
      <h2>Account Settings</h2>
      <p>Update your information and change your password</p>

      <div className="fresh-profile-card">
        <h3><i className="fa-solid fa-user"></i> Profile Information <small>Update your personal details</small></h3>
        <label>Full Name</label>
        <input defaultValue={userName} />
        <label>Email Address</label>
        <input placeholder="Enter your email" />
        <label>Phone Number</label>
        <input placeholder="01xxxxxxxxx" />
        <button className="btn fresh-save-btn"><i className="fa-solid fa-floppy-disk me-2"></i>Save Changes</button>
        <div className="fresh-account-info">
          <strong>Account Information</strong>
          <p><span>User ID</span><b>-</b></p>
          <p><span>Role</span><b>User</b></p>
        </div>
      </div>

      <div className="fresh-profile-card password">
        <h3><i className="fa-solid fa-lock"></i> Change Password <small>Update your account password</small></h3>
        <label>Current Password</label>
        <input placeholder="Enter your current password" type="password" />
        <label>New Password</label>
        <input placeholder="Enter your new password" type="password" />
        <small className="fresh-password-note">Must be at least 8 characters</small>
        <label>Confirm New Password</label>
        <input placeholder="Confirm your new password" type="password" />
        <button className="btn fresh-password-btn"><i className="fa-solid fa-lock me-2"></i>Change Password</button>
      </div>
    </section>
  );
}

function Addresses({ addresses, onAdd, onEdit, onDelete }) {
  return (
    <section className="fresh-account-content addresses">
      <div className="fresh-address-heading">
        <div>
          <h2>My Addresses</h2>
          <p>Manage your saved delivery addresses</p>
        </div>
        <button className="btn fresh-save-btn" onClick={onAdd}>+ Add Address</button>
      </div>
      {addresses.length === 0 ? (
        <div className="fresh-no-address-card">
          <span><i className="fa-solid fa-location-dot"></i></span>
          <h3>No Addresses Yet</h3>
          <p>Add your first delivery address to make checkout faster and easier.</p>
          <button className="btn fresh-save-btn" onClick={onAdd}>+ Add Your First Address</button>
        </div>
      ) : (
        <div className="fresh-address-list">
          {addresses.map((address) => (
            <div className="fresh-address-card" key={address.id}>
              <i className="fa-solid fa-location-dot"></i>
              <div>
                <h3>{address.name}</h3>
                <p>{address.details}</p>
                <small><i className="fa-solid fa-phone me-2"></i>{address.phone} <i className="fa-solid fa-city ms-3 me-2"></i>{address.city}</small>
              </div>
              <button type="button" aria-label="Edit address" onClick={() => onEdit(address)}><i className="fa-solid fa-pen"></i></button>
              <button type="button" aria-label="Delete address" onClick={() => onDelete(address.id)}><i className="fa-solid fa-trash"></i></button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function AddressModal({ address, onClose, onSave }) {
  const [formData, setFormData] = React.useState({
    name: address?.name || "",
    details: address?.details || "",
    phone: address?.phone || "",
    city: address?.city || "",
  });
  const updateField = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      id: address?.id,
      name: formData.name.trim(),
      details: formData.details.trim(),
      phone: formData.phone.trim(),
      city: formData.city.trim(),
    });
  };

  return (
    <div className="fresh-modal-backdrop">
      <form className="fresh-address-modal" onSubmit={handleSubmit}>
        <button className="fresh-modal-close" type="button" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        <h2>{address ? "Edit Address" : "Add New Address"}</h2>
        <label htmlFor="address-name">Address Name</label>
        <input id="address-name" placeholder="e.g. Home, Office" required value={formData.name} onChange={updateField("name")} />
        <label htmlFor="address-details">Full Address</label>
        <textarea id="address-details" placeholder="Street, building, apartment..." required value={formData.details} onChange={updateField("details")} />
        <div className="fresh-modal-grid">
          <div>
            <label htmlFor="address-phone">Phone Number</label>
            <input id="address-phone" placeholder="01xxxxxxxxx" required pattern="01[0125][0-9]{8}" value={formData.phone} onChange={updateField("phone")} />
          </div>
          <div>
            <label htmlFor="address-city">City</label>
            <input id="address-city" placeholder="Cairo" required value={formData.city} onChange={updateField("city")} />
          </div>
        </div>
        <div className="fresh-modal-actions">
          <button className="btn" type="button" onClick={onClose}>Cancel</button>
          <button className="btn fresh-save-btn" type="submit">{address ? "Save Address" : "Add Address"}</button>
        </div>
      </form>
    </div>
  );
}

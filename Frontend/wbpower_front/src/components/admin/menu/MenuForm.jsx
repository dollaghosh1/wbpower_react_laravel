import React, { useState } from 'react';

function MenuForm() {
  // Existing menu items, for example fetched from API or initial state
  const [menuItems, setMenuItems] = useState([
    { id: 1, label: 'Home', url: '/', parentId: null },
    { id: 2, label: 'About', url: '/about', parentId: null },
    { id: 3, label: 'Services', url: '/services', parentId: null },
  ]);

  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [parentId, setParentId] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!label || !url) {
      setMessage('Please fill in both label and URL.');
      return;
    }

    const newMenuItem = {
      label,
      url,
      parentId: parentId === 'null' ? null : Number(parentId),
    };

    // Example: POST request to API (replace URL with your own)
    try {
      const response = await fetch('https://your-api-endpoint.com/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMenuItem),
      });

      if (response.ok) {
        setMessage('Menu item added successfully!');
        // Optionally update local menu items state if you want to show them here
        setMenuItems([...menuItems, { id: Date.now(), ...newMenuItem }]);
        setLabel('');
        setUrl('');
        setParentId(null);
      } else {
        const errorData = await response.json();
        setMessage('Error: ' + (errorData.message || 'Failed to add menu item.'));
      }
    } catch (error) {
      setMessage('Network error: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Add Menu Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Label:
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            URL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Parent Menu:
            <select
              value={parentId === null ? 'null' : parentId}
              onChange={(e) => setParentId(e.target.value)}
            >
              <option value="null">None (top-level menu)</option>
              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit">Add Menu Item</button>
      </form>

      {message && <p>{message}</p>}

      <h3>Current Menu</h3>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            {item.label} ({item.url}) {item.parentId && `- child of ${item.parentId}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MenuForm;
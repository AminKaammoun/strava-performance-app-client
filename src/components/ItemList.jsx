import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

const ItemList = observer(() => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    itemStore.loadItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await itemStore.addItem({ name, description, done: false });
    setName("");
    setDescription("");
  };

  const toggleDone = (item) => {
    itemStore.toggleDone(item);
  };

  const handleDelete = (id) => {
    itemStore.deleteItem(id);
  };

  if (itemStore.error) {
    return <p className="error">{itemStore.error}</p>;
  }

  return (
    <div className="item-list">
      <form onSubmit={handleSubmit} className="item-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add item</button>
      </form>

      {itemStore.loading ? (
        <p>Loading...</p>
      ) : itemStore.items.length === 0 ? (
        <p>No items yet. Add one above.</p>
      ) : (
        <ul>
          {itemStore.items.map((item) => (
            <li key={item.id} className={item.done ? "done" : ""}>
              <label>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleDone(item)}
                />
                <strong>{item.name}</strong>
              </label>
              {item.description && (
                <span className="description"> — {item.description}</span>
              )}
              <button
                className="delete-btn"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default ItemList;

import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
export default function App() {
  const [showFriend, setShowFriend] = useState(false);
  const [friends, setFreinds] = useState(initialFriends);
  const [selectedFriend, setSeletedFriend] = useState(null);
  function handleShowAddFreind() {
    setShowFriend((show) => !show);
    setSeletedFriend(null);
  }
  function handleAddFriend(friend) {
    setFreinds([...friends, friend]);
  }
  function handleSelection(friend) {
    setSeletedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowFriend(false);
  }
  function handleSplitBill(value) {
    setFreinds((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSeletedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          setFreinds={setFreinds}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />
        {showFriend && (
          <FormAddFriend
            friends={friends}
            onhHandleAdd={handleAddFriend}
            setSeletedFriend={setSeletedFriend}
          />
        )}
        <Button onClick={handleShowAddFreind} selectedFriend={selectedFriend}>
          {showFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}
function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <div>
      {friends.map((friend) => (
        <FriendItem
          key={friend.id}
          friend={friend}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </div>
  );
}
function FriendItem({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <ul>
      <li className={isSelected ? "selected" : ""}>
        <img src={friend.image} alt={friend.name} />
        <h3>{friend.name}</h3>
        {friend.balance < 0 && (
          <p className="red">
            You owe {friend.name} {Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owe you {Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance === 0 && <p>You and {friend.name} are even</p>}
        <Button onClick={() => onSelection(friend)}>
          {isSelected ? "Close" : "Select"}
        </Button>
      </li>
    </ul>
  );
}
function FormAddFriend({ onhHandleAdd }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const id = crypto.randomUUID();
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };

    onhHandleAdd(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🖼️ Image URL </label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExpenses, setUserExpenses] = useState("");
  const paidByFriend = bill - userExpenses;
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -userExpenses);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPlit a bill with {selectedFriend.name}</h2>
      <label>💰 Bill value </label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />
      <label>🕴️ Your expenses </label>
      <input
        type="text"
        value={userExpenses}
        onChange={(e) =>
          setUserExpenses(
            +e.target.value > bill ? userExpenses : +e.target.value
          )
        }
      />
      <label>🧑‍🤝‍🧑 {selectedFriend.name} expenses</label>
      <input type="text" disabled value={paidByFriend} />
      <label>🤑 Who is paying the bill </label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">Your friend</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}

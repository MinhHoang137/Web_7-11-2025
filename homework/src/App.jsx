import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function SearchForm({onChangeValue}) {
  return (
    <form>
      <input type="text" placeholder="Tìm theo tên người dùng..." onChange={(e) => {
        onChangeValue(e.target.value)
      }} />
    </form>
  )
}

function ResultTable({ keyword, user, onAdded }) { 
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [editing, setEditing] = useState(null); 

  // Tải dữ liệu 1 lần khi component mount 
  useEffect(() => { 
    fetch("https://jsonplaceholder.typicode.com/users") 
      .then(res => res.json()) 
      .then(data => { setUsers(data); setLoading(false); })
      .catch(err => { console.error('Failed to load users', err); setLoading(false); }); 
  }, []);

  // Thêm user mới từ AddUser (nếu có) và reset newUser bằng onAdded()
  useEffect(() => { 
    if (user) { 
      setUsers(prev => [...prev, { ...user, id: Date.now() }]); 
      onAdded && onAdded(); 
    } 
  }, [user, onAdded]);

  const filteredUsers = users.filter( 
    (u) => 
      u.name.toLowerCase().includes(keyword.toLowerCase()) || 
      u.username.toLowerCase().includes(keyword.toLowerCase()) 
  );

  // Bắt đầu sửa: deep copy user + address
  const editUser = (u) => { 
    setEditing({ ...u, address: { ...u.address } }); 
  };

  const handleEditChange = (field, value) => { 
    setEditing(prev => { 
      if (!prev) return prev; 
      if (["street", "suite", "city"].includes(field)) { 
        return { ...prev, address: { ...prev.address, [field]: value } }; 
      }
      return { ...prev, [field]: value }; 
    });
  };

  const saveUser = () => { 
    if (!editing) return; 
    setUsers(prev => prev.map(u => u.id === editing.id ? editing : u)); 
    setEditing(null); 
  };

  const cancelEdit = () => setEditing(null);

  const removeUser = (id) => { 
    setUsers(prev => prev.filter(x => x.id !== id)); 
    if (editing && editing.id === id) setEditing(null); 
  };

  return(
    <>
      {editing && (
        <div style={{border: '1px solid #ccc', padding: '12px', marginBottom: '16px'}}>
          <h4>Sửa người dùng (ID {editing.id})</h4>
          <div>
            <label>Name: </label>
            <input type="text" value={editing.name} onChange={e => handleEditChange('name', e.target.value)} />
          </div>
          <div>
            <label>Username: </label>
            <input type="text" value={editing.username} onChange={e => handleEditChange('username', e.target.value)} />
          </div>
            <div>
            <label>Email: </label>
            <input type="email" value={editing.email} onChange={e => handleEditChange('email', e.target.value)} />
          </div>
          <fieldset style={{marginTop:'8px'}}>
            <legend>Địa chỉ</legend>
            <div>
              <label>Street: </label>
              <input type="text" value={editing.address.street} onChange={e => handleEditChange('street', e.target.value)} />
            </div>
            <div>
              <label>Suite: </label>
              <input type="text" value={editing.address.suite} onChange={e => handleEditChange('suite', e.target.value)} />
            </div>
            <div>
              <label>City: </label>
              <input type="text" value={editing.address.city} onChange={e => handleEditChange('city', e.target.value)} />
            </div>
          </fieldset>
          <div style={{marginTop:'8px'}}>
            <label>Phone: </label>
            <input type="text" value={editing.phone} onChange={e => handleEditChange('phone', e.target.value)} />
          </div>
          <div>
            <label>Website: </label>
            <input type="text" value={editing.website} onChange={e => handleEditChange('website', e.target.value)} />
          </div>
          <div style={{marginTop:'10px'}}>
            <button onClick={saveUser}>Lưu</button>
            <button onClick={cancelEdit} style={{marginLeft:'8px'}}>Hủy</button>
          </div>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr><td colSpan={6}>Đang tải...</td></tr>
          )}
          {!loading && filteredUsers.map((u) => (
            <tr key={u.id} style={editing && editing.id === u.id ? {background:'#fffae6'} : {}}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.address?.city}</td>
              <td>
                <button onClick={() => editUser(u)}>Sửa</button>
                <button className="btn-delete" onClick={() => removeUser(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function AddUser({onAdd}){
  const [adding, setAdding] = useState(false); 
  const [user, setUser] = useState({ 
    name: "", username: "", email: "", 
    address: { street: "", suite: "", city: "" }, 
    phone: "", website: "" 
  }); 
  const handleChange = (e) => { 
    const { id, value } = e.target; 
    if (["street", "suite", "city"].includes(id)) { 
      setUser({ ...user, address: { ...user.address, [id]: value } }); 
    } else { 
      setUser({ ...user, [id]: value }); 
    } 
  }; 
  return(
    <div> 
      <button onClick={() => setAdding(true)}>Thêm</button> 
      {adding && ( 
        <div> 
          <div> 
            <h4>Thêm người dùng</h4> 
              <label htmlFor="name"> Name: </label> 
              <input id="name" type="text" value={user.name} 
              onChange={handleChange}/> 
          </div> 
          <div> 
            <label htmlFor="username"> Username: </label> 
            <input id="username" type="text" value={user.username} 
            onChange={handleChange}/> 
          </div> 
          <div> 
            <label htmlFor="email"> Email: </label> 
            <input id="email" type="email" value={user.email} 
            onChange={handleChange}/> 
          </div> 
          <div> 
            <h5>Địa chỉ</h5> 
            <div> 
              <label htmlFor="street"> Street: </label> 
              <input id="street" type="text" value={user.address.street} 
              onChange={handleChange}/> 
            </div> 
            <div> 
              <label htmlFor="suite"> Suite: </label> 
              <input id="suite" type="text" value={user.address.suite} 
              onChange={handleChange}/> 
            </div> 
            <div> 
              <label htmlFor="city"> City: </label> 
              <input id="city" type="text" value={user.address.city} 
              onChange={handleChange}/> 
            </div> 
          </div> 
          <div> 
            <label htmlFor="phone"> Phone: </label> 
            <input id="phone" type="text" value={user.phone} 
            onChange={handleChange}/> 
          </div> 
          <div> 
            <label htmlFor="website"> Website: </label> 
            <input id="website" type="text" value={user.website} 
            onChange={handleChange}/> 
          </div> 
          <button onClick={() => { onAdd(user); setUser({ name: "", username: "", email: "", address: { street: "", suite: "", city: "" }, phone: "", website: "" }); setAdding(false); }}>Thêm</button> 
        </div> 
      )}
    </div>
  )
}

function App() {

  const [kw, setKeyword] = useState(""); 
  const [newUser, setNewUser] = useState(null);

  return (
    <>
      <div>
        {/* <h1>Quản lý người dùng</h1> */}
        <SearchForm onChangeValue={setKeyword} />
        <AddUser onAdd={(user) => setNewUser(user)} />
        <ResultTable keyword={kw} user={newUser}  
          onAdded={() => setNewUser(null)}/>
      </div>
      
    </>
  )
}

export default App

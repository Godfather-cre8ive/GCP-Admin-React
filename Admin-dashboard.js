import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '', category: '', image: null });
  const [blogData, setBlogData] = useState({ title: '', summary: '', content: '', image: null });
  const [portfolio, setPortfolio] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [view, setView] = useState('login');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('${process.env.REACT_APP_API_BASE_URL}/api/auth/login', loginData);
      setToken(res.data.token);
      setView('dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, val]) => form.append(key, val));
    try {
      await axios.post('${process.env.REACT_APP_API_BASE_URL}/api/portfolio', form, {
        headers: { Authorization: token, 'Content-Type': 'multipart/form-data' }
      });
      alert('Portfolio item added');
      loadPortfolio();
    } catch (err) {
      alert('Upload failed');
    }
  };

  const handleBlogUpload = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(blogData).forEach(([key, val]) => form.append(key, val));
    try {
      await axios.post('${process.env.REACT_APP_API_BASE_URL}/api/blogs', form, {
        headers: { Authorization: token, 'Content-Type': 'multipart/form-data' }
      });
      alert('Blog post added');
      loadBlogs();
    } catch (err) {
      alert('Blog upload failed');
    }
  };

  const loadPortfolio = async () => {
    const res = await axios.get('${process.env.REACT_APP_API_BASE_URL}/api/portfolio');
    setPortfolio(res.data);
  };

  const loadBlogs = async () => {
    const res = await axios.get('${process.env.REACT_APP_API_BASE_URL}/api/blogs');
    setBlogs(res.data);
  };

  const loadContacts = async () => {
    const res = await axios.get('${process.env.REACT_APP_API_BASE_URL}/api/contact-messages');
    setContacts(res.data);
  };

  useEffect(() => {
    if (view === 'dashboard') {
      loadPortfolio();
      loadBlogs();
      loadContacts();
    }
  }, [view]);

  if (view === 'login') {
    return (
      <form onSubmit={handleLogin} className="p-4 max-w-sm mx-auto">
        <h2 className="text-xl mb-4">Admin Login</h2>
        <input type="text" placeholder="Username" onChange={e => setLoginData({ ...loginData, username: e.target.value })} className="w-full mb-2 p-2 border" />
        <input type="password" placeholder="Password" onChange={e => setLoginData({ ...loginData, password: e.target.value })} className="w-full mb-4 p-2 border" />
        <button className="bg-blue-500 text-white px-4 py-2">Login</button>
      </form>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4">Add Portfolio Item</h2>
      <form onSubmit={handleUpload} className="mb-6">
        <input type="text" placeholder="Title" onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full mb-2 p-2 border" />
        <input type="text" placeholder="Description" onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full mb-2 p-2 border" />
        <input type="text" placeholder="Category" onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full mb-2 p-2 border" />
        <input type="file" onChange={e => setFormData({ ...formData, image: e.target.files[0] })} className="mb-4" />
        <button className="bg-green-600 text-white px-4 py-2">Upload</button>
      </form>

      <h2 className="text-2xl mb-4">Add Blog Post</h2>
      <form onSubmit={handleBlogUpload} className="mb-6">
        <input type="text" placeholder="Title" onChange={e => setBlogData({ ...blogData, title: e.target.value })} className="w-full mb-2 p-2 border" />
        <input type="text" placeholder="Summary" onChange={e => setBlogData({ ...blogData, summary: e.target.value })} className="w-full mb-2 p-2 border" />
        <textarea placeholder="Content" onChange={e => setBlogData({ ...blogData, content: e.target.value })} className="w-full mb-2 p-2 border h-32"></textarea>
        <input type="file" onChange={e => setBlogData({ ...blogData, image: e.target.files[0] })} className="mb-4" />
        <button className="bg-purple-600 text-white px-4 py-2">Post Blog</button>
      </form>

      <h2 className="text-xl mb-2">Portfolio Items</h2>
      <ul className="mb-8">
        {portfolio.map(item => (
          <li key={item._id} className="mb-4 border p-2">
            <h3 className="font-bold">{item.title}</h3>
            <p>{item.description}</p>
            <img src={item.imageUrl} alt={item.title} className="w-32 mt-2" />
          </li>
        ))}
      </ul>

      <h2 className="text-xl mb-2">Blog Posts</h2>
      <ul className="mb-8">
        {blogs.map(post => (
          <li key={post._id} className="mb-4 border p-2">
            <h3 className="font-bold">{post.title}</h3>
            <p>{post.summary}</p>
            <img src={post.imageUrl} alt={post.title} className="w-32 mt-2" />
          </li>
        ))}
      </ul>

      <h2 className="text-xl mb-2">Contact Messages</h2>
      <ul>
        {contacts.map(msg => (
          <li key={msg._id} className="mb-4 border p-2">
            <p><strong>{msg.name}</strong> ({msg.email})</p>
            <p><em>{msg.service}</em></p>
            <p>{msg.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

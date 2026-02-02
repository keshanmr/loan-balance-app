import React, { useState, useMemo, useEffect } from 'react';
import { 
  User, Users, Plus, LogOut, Search, 
  Check, X, Banknote, ArrowUpRight, ArrowDownLeft, Home, UserPlus, HandCoins, History, Filter, ChevronLeft, Wallet
} from 'lucide-react';

// --- CSS Styles (ඇප් එකේ විලාසිතා) ---
const styles = `
  /* මූලික සැකසුම් */
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f3f4f6;
  }
  
  .app-container {
    max-width: 450px;
    margin: 0 auto;
    background-color: #f9fafb;
    min-height: 100vh;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    position: relative;
    padding-bottom: 80px;
  }

  /* Login පිටුව */
  .login-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    text-align: center;
  }

  .logo-box {
    background-color: #059669;
    width: 64px;
    height: 64px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    margin-left: auto;
    margin-right: auto;
  }

  .title {
    font-size: 24px;
    font-weight: bold;
    color: #1f2937;
    margin: 0;
  }

  .input-field {
    width: 100%;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    margin-bottom: 12px;
    font-size: 16px;
    box-sizing: border-box;
  }

  .btn-primary {
    width: 100%;
    background-color: #059669;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-primary:hover {
    background-color: #047857;
  }

  /* Header */
  .header {
    background-color: white;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
  }

  /* Dashboard */
  .main-content {
    padding: 16px;
  }

  .balance-card {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    color: white;
    padding: 24px;
    border-radius: 20px;
    margin-bottom: 24px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .balance-total {
    text-align: center;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .balance-total h4 {
    margin: 0;
    font-size: 14px;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .balance-total h2 {
    margin: 5px 0 0 0;
    font-size: 32px;
    font-weight: 800;
  }

  .balance-row {
    display: flex;
    justify-content: space-between;
  }

  .label-receive { color: #6ee7b7; font-size: 12px; margin-bottom: 4px; display: flex; align-items: center; gap: 4px; }
  .label-pay { color: #fdba74; font-size: 12px; margin-bottom: 4px; text-align: right; display: flex; align-items: center; justify-content: flex-end; gap: 4px; }
  .amount { font-size: 20px; font-weight: bold; margin: 0; }

  .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #6b7280;
    margin: 24px 0 12px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Lists */
  .list-item {
    background-color: white;
    padding: 16px;
    border-radius: 12px;
    border: 1px solid #f3f4f6;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .list-item:hover {
    background-color: #f9fafb;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    background-color: #f3f4f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 12px;
    color: #374151;
  }

  .text-green { color: #059669; font-weight: bold; }
  .text-red { color: #ea580c; font-weight: bold; }
  .text-muted { color: #6b7280; font-size: 12px; }

  /* Add Expense Form */
  .big-input {
    width: 100%;
    font-size: 30px;
    font-weight: bold;
    padding: 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    margin-bottom: 12px;
    box-sizing: border-box;
  }

  .tab-container {
    display: flex;
    background-color: #e5e7eb;
    padding: 4px;
    border-radius: 10px;
    margin-bottom: 16px;
  }

  .tab-btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #6b7280;
    font-weight: 600;
    cursor: pointer;
  }

  .tab-btn.active {
    background-color: white;
    color: #059669;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .split-toggle {
    display: flex;
    align-items: center;
    background: white;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    margin-bottom: 16px;
    cursor: pointer;
  }

  .split-toggle:hover {
    background-color: #f9fafb;
  }

  .payer-toggle {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
  }
  
  .payer-btn {
    flex: 1;
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
    color: #6b7280;
    cursor: pointer;
    font-size: 14px;
  }

  .payer-btn.selected {
    background-color: #1f2937;
    color: white;
    border-color: #1f2937;
  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 16px;
  }

  .btn-group {
    padding: 12px;
    border: 1px solid #e5e7eb;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-group:hover {
    background-color: #ecfdf5;
  }

  .btn-cancel {
    width: 100%;
    padding: 12px;
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    margin-top: 8px;
  }
  
  .btn-outline {
    background: white;
    border: 1px solid #d1d5db;
    color: #374151;
    padding: 8px 12px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
  }
  
  .btn-outline:hover {
    background-color: #f3f4f6;
  }

  /* Search & Friends Styles */
  .search-box {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
  }

  .friend-card {
    background: white;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .btn-small {
    background-color: #059669;
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    border: none;
    cursor: pointer;
    font-weight: bold;
  }

  .search-result {
    background-color: #ecfdf5;
    border: 1px solid #059669;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* Group Selection Styles */
  .select-friend-row {
    display: flex;
    align-items: center;
    padding: 12px;
    background: white;
    border: 1px solid #f3f4f6;
    margin-bottom: 8px;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .select-friend-row.selected {
    border-color: #059669;
    background-color: #ecfdf5;
  }

  .checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid #d1d5db;
    border-radius: 6px;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .checkbox.checked {
    background-color: #059669;
    border-color: #059669;
  }
  
  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
    padding: 20px;
  }
  .modal {
    background: white;
    padding: 24px;
    border-radius: 16px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    animation: fadeIn 0.2s ease-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* History Styles */
  .history-item {
    background: white;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #f3f4f6;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .history-date {
    font-size: 10px;
    color: #9ca3af;
    margin-top: 4px;
  }
  .history-desc {
    font-weight: 600;
    font-size: 14px;
    color: #374151;
  }
  .history-payer {
    font-size: 11px;
    color: #6b7280;
  }
  .tag-settle {
    background-color: #dbeafe;
    color: #1e40af;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    margin-right: 6px;
    font-weight: 600;
  }
  .tag-group {
    background-color: #f3f4f6;
    color: #4b5563;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    margin-right: 6px;
    font-weight: 600;
    border: 1px solid #e5e7eb;
  }
  .month-header {
    font-size: 12px;
    font-weight: 700;
    color: #6b7280;
    margin: 20px 0 10px 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Detail View Header */
  .detail-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e7eb;
  }
  .back-btn {
    background: none;
    border: none;
    cursor: pointer;
    margin-right: 10px;
    color: #374151;
  }

  /* Bottom Nav */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 450px;
    margin: 0 auto;
    background-color: white;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-around;
    padding: 12px 0;
    z-index: 20;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
  }

  .nav-item.active {
    color: #059669;
  }

  .nav-text {
    font-size: 10px;
    margin-top: 4px;
  }

  .fab-btn {
    background-color: #059669;
    color: white;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    position: relative;
    top: -24px;
    box-shadow: 0 4px 10px rgba(5, 150, 105, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;

// --- Mock Data for Initialization ---
const INITIAL_USERS = [
  { id: 'u1', name: 'Nimal', mobile: '0771234567' },
  { id: 'u2', name: 'Kamal', mobile: '0777654321' },
  { id: 'u3', name: 'Amara', mobile: '0711112222' }
];

const INITIAL_FRIENDS = [
  { id: 'f1', userId: 'u1', friendId: 'u2', status: 'accepted' },
];

const INITIAL_GROUPS = [
  { id: 'g1', name: 'Boardima Boys', members: ['u1', 'u2'], createdBy: 'u1' }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('auth'); 
  
  // Data States
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('podu_users')) || INITIAL_USERS);
  const [friendships, setFriendships] = useState(() => JSON.parse(localStorage.getItem('podu_friendships')) || INITIAL_FRIENDS);
  const [groups, setGroups] = useState(() => JSON.parse(localStorage.getItem('podu_groups')) || INITIAL_GROUPS);
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('podu_expenses')) || []);
  
  // Inputs
  const [mobileInput, setMobileInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  
  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  // Group Creation States
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedFriendsForGroup, setSelectedFriendsForGroup] = useState([]);

  // Add Expense State
  const [expenseType, setExpenseType] = useState('group'); // 'group' or 'personal'
  const [includeMe, setIncludeMe] = useState(true); // Shared or Full Loan
  const [paidByMe, setPaidByMe] = useState(true); // Who paid?

  // Settle Up Modal State
  const [settleUser, setSettleUser] = useState(null); // { id, name, amount, isOwedToMe }

  // History Filter State
  const [historyFilter, setHistoryFilter] = useState('all'); 

  // Detail View State
  const [viewDetails, setViewDetails] = useState(null); // { type: 'friend'|'group', data: object }

  // --- SAVE TO LOCAL STORAGE (Persist Data) ---
  useEffect(() => {
    localStorage.setItem('podu_users', JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    localStorage.setItem('podu_friendships', JSON.stringify(friendships));
  }, [friendships]);

  useEffect(() => {
    localStorage.setItem('podu_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('podu_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // --- ගණනය කිරීම් (Gross Balances - No Auto Netting) ---
  const balances = useMemo(() => {
    if (!user) return [];
    const acc = {}; 

    expenses.forEach(exp => {
      if (!exp.involvedUsers || !exp.amount) return;
      
      const splitAmount = exp.amount / exp.involvedUsers.length;
      
      if (exp.isSettlement) {
         if (exp.payerId === user.id) {
            exp.involvedUsers.forEach(uid => {
               if(uid === user.id) return;
               if(!acc[uid]) acc[uid] = { toReceive: 0, toPay: 0 };
               acc[uid].toPay -= exp.amount; 
            });
         } else if (exp.involvedUsers.includes(user.id)) {
            const payer = exp.payerId;
            if(!acc[payer]) acc[payer] = { toReceive: 0, toPay: 0 };
            acc[payer].toReceive -= exp.amount;
         }
      } else {
         if (exp.payerId === user.id) {
            exp.involvedUsers.forEach(uid => {
               if (uid !== user.id) {
                  if(!acc[uid]) acc[uid] = { toReceive: 0, toPay: 0 };
                  acc[uid].toReceive += splitAmount;
               }
            });
         } else if (exp.involvedUsers.includes(user.id)) {
            const payer = exp.payerId;
            if(!acc[payer]) acc[payer] = { toReceive: 0, toPay: 0 };
            acc[payer].toPay += splitAmount;
         }
      }
    });

    const result = [];
    Object.keys(acc).forEach(uid => {
       const u = users.find(x => x.id === uid);
       if(!u) return;
       let r = acc[uid].toReceive;
       let p = acc[uid].toPay;

       if (p < 0) { r += Math.abs(p); p = 0; }
       if (r < 0) { p += Math.abs(r); r = 0; }

       const finalReceive = Math.round(r * 100) / 100;
       const finalPay = Math.round(p * 100) / 100;

       if (finalReceive > 1) {
          result.push({ otherUser: u, amount: finalReceive, type: 'receive' });
       }
       if (finalPay > 1) {
          result.push({ otherUser: u, amount: finalPay, type: 'pay' });
       }
    });
    
    // Sort by amount descending (ලොකුම ගණන් උඩට)
    return result.sort((a, b) => b.amount - a.amount);
  }, [expenses, user, users]);

  // Derived Totals
  const totalReceivable = balances.filter(b => b.type === 'receive').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPayable = balances.filter(b => b.type === 'pay').reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalReceivable - totalPayable;

  // --- Functions ---

  const handleLogin = () => {
    if (!mobileInput) return;
    let currentUser = users.find(u => u.mobile === mobileInput);
    if (!currentUser) {
      if (!nameInput) return alert('කරුණාකර ඔබේ නම ඇතුලත් කරන්න');
      const newUserId = `u${Date.now()}`;
      currentUser = { id: newUserId, name: nameInput, mobile: mobileInput, createdAt: new Date().toISOString() };
      setUsers([...users, currentUser]);
    }
    localStorage.setItem('podu_current_user', mobileInput);
    setUser(currentUser);
    setView('dashboard');
  };

  useEffect(() => {
    const savedMobile = localStorage.getItem('podu_current_user');
    if (savedMobile && users.length > 0 && !user) {
      const foundUser = users.find(u => u.mobile === savedMobile);
      if (foundUser) setUser(foundUser);
    }
  }, []); 

  const logout = () => {
    localStorage.removeItem('podu_current_user');
    setUser(null);
    setView('auth');
  };

  const handleSearch = () => {
    if(!searchQuery) return;
    const found = users.find(u => u.mobile === searchQuery && u.id !== user.id);
    setSearchResult(found || 'not_found');
  };

  const addFriend = (friendId) => {
    const exists = friendships.find(f => 
      (f.userId === user.id && f.friendId === friendId) || 
      (f.userId === friendId && f.friendId === user.id)
    );
    if(exists) return alert('මේ යාලුවා දැනටමත් ඔබේ ලිස්ට් එකේ ඉන්නවා.');

    const newFriendship = {
      id: `f${Date.now()}`, userId: user.id, friendId: friendId, status: 'accepted', createdAt: new Date().toISOString()
    };
    setFriendships([...friendships, newFriendship]);
    setSearchResult(null);
    setSearchQuery('');
    alert('යාලුවා එකතු කරගත්තා!');
  };

  const toggleFriendSelection = (friendId) => {
    if (selectedFriendsForGroup.includes(friendId)) {
      setSelectedFriendsForGroup(selectedFriendsForGroup.filter(id => id !== friendId));
    } else {
      setSelectedFriendsForGroup([...selectedFriendsForGroup, friendId]);
    }
  };

  const handleCreateGroup = () => {
    if (!newGroupName) return alert('කරුණාකර ගෲප් එකට නමක් දෙන්න.');
    if (selectedFriendsForGroup.length === 0) return alert('අවම වශයෙන් එක යාලුවෙක්වත් තෝරන්න.');

    const newGroup = {
      id: `g${Date.now()}`,
      name: newGroupName,
      createdBy: user.id,
      members: [user.id, ...selectedFriendsForGroup],
      createdAt: new Date().toISOString()
    };
    setGroups([...groups, newGroup]);
    setNewGroupName('');
    setSelectedFriendsForGroup([]);
    setView('groups');
    alert('ගෲප් එක සාදන ලදී!');
  };

  const getMyFriends = () => {
    return friendships
      .filter(f => f.userId === user.id || f.friendId === user.id)
      .map(f => {
        const friendId = f.userId === user.id ? f.friendId : f.userId;
        return users.find(u => u.id === friendId);
      });
  };

  // Modified saveExpense to include groupId
  const saveExpense = (amt, desc, involvedMembers, specificPayerId, groupId = null) => {
      const newExpense = {
        id: `e${Date.now()}`,
        amount: amt, 
        description: desc, 
        payerId: specificPayerId || user.id, 
        involvedUsers: involvedMembers, 
        groupId: groupId, // Save group ID
        date: new Date().toISOString()
      };
      setExpenses([...expenses, newExpense]);
      setIncludeMe(true);
      setPaidByMe(true);
      setView('dashboard');
  };

  const openSettleModal = (e, balanceItem) => {
    e.stopPropagation(); // Stop clicking the list item
    setSettleUser({
        id: balanceItem.otherUser.id,
        name: balanceItem.otherUser.name,
        amount: balanceItem.amount,
        type: balanceItem.type 
    });
  };

  const confirmSettlement = () => {
     if (!settleUser) return;
     const settleInput = document.getElementById('settleAmount');
     const amt = parseFloat(settleInput ? settleInput.value : 0);
     
     if (!amt || amt <= 0) return alert('කරුණාකර වටිනාකමක් ඇතුලත් කරන්න');

     const description = "Settlement (ණය පියවීම)";
     let payerId, involvedUsers;

     if (settleUser.type === 'receive') {
         payerId = settleUser.id;
         involvedUsers = [user.id];
     } else {
         payerId = user.id;
         involvedUsers = [settleUser.id];
     }
     
     const newExpense = {
        id: `s${Date.now()}`, amount: amt, description: description, payerId: payerId, involvedUsers: involvedUsers, date: new Date().toISOString(), isSettlement: true
     };

     setExpenses([...expenses, newExpense]);
     setSettleUser(null);
     alert('ගනුදෙනුව පියවන ලදී!');
  };

  // Helper to filter details
  const getDetailTransactions = () => {
    if (!viewDetails) return [];
    
    let filtered = [];
    if (viewDetails.type === 'friend') {
      const friendId = viewDetails.data.id;
      filtered = expenses.filter(exp => 
        (exp.payerId === user.id && exp.involvedUsers.includes(friendId)) ||
        (exp.payerId === friendId && exp.involvedUsers.includes(user.id))
      );
    } else if (viewDetails.type === 'group') {
      const groupId = viewDetails.data.id;
      filtered = expenses.filter(exp => exp.groupId === groupId);
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Render Transaction Item Logic
  const renderTransactionItem = (exp) => {
    const isPayer = exp.payerId === user.id;
    const payerName = isPayer ? "You" : users.find(u => u.id === exp.payerId)?.name || "Unknown";
    const group = groups.find(g => g.id === exp.groupId);
    
    // Calculate display amount based on context
    let amountVal = exp.amount;
    
    // Only calculate split for Friend Detail View (and not settlements)
    if (viewDetails?.type === 'friend' && !exp.isSettlement) {
        amountVal = exp.amount / exp.involvedUsers.length;
    }
    
    let amountDisplay = `LKR ${amountVal.toFixed(0)}`;
    let colorStyle = '#374151';

    if (exp.isSettlement) {
      if (isPayer) {
          amountDisplay = `- LKR ${amountVal.toFixed(0)}`;
          colorStyle = '#ea580c'; 
      } else {
          amountDisplay = `+ LKR ${amountVal.toFixed(0)}`;
          colorStyle = '#059669'; 
      }
    } else {
        amountDisplay = `- LKR ${amountVal.toFixed(0)}`;
        if (isPayer) {
            colorStyle = '#ea580c'; 
        } else {
            colorStyle = '#7c3aed'; 
        }
    }

    // Subtitle logic (UPDATED HERE)
    let subText = "";
    if (exp.isSettlement && exp.involvedUsers && exp.involvedUsers.length > 0) {
        const recipientId = exp.involvedUsers[0];
        const isRecipient = recipientId === user.id;
        const recipientName = isRecipient ? "You" : users.find(u => u.id === recipientId)?.name || "Unknown";
        subText = `${isPayer ? "You" : payerName} paid ${isRecipient ? "You" : recipientName}`;
    } else {
        subText = isPayer ? "You paid" : `${payerName} paid`;
    }

    return (
      <div key={exp.id} className="history-item">
        <div>
          <div style={{display:'flex', alignItems:'center', flexWrap:'wrap', gap:'4px', marginBottom:'2px'}}>
            {exp.isSettlement && <span className="tag-settle">Settlement</span>}
            {group && <span className="tag-group">{group.name}</span>}
          </div>
          <p className="history-desc">{exp.description}</p>
          <p className="history-payer">
            {subText} • {new Date(exp.date).toLocaleDateString()}
          </p>
        </div>
        <div style={{textAlign:'right'}}>
          <p style={{fontWeight:'bold', color: colorStyle}}>
            {amountDisplay}
          </p>
        </div>
      </div>
    );
  };

  // Helper to get filtered history
  const getFilteredHistory = () => {
    // 1. Filter by involved users (Show only if I am involved or I paid)
    let filtered = expenses.filter(exp => 
      (exp.involvedUsers && exp.involvedUsers.includes(user.id)) || exp.payerId === user.id
    );

    // 2. Filter by Type
    if (historyFilter === 'expenses') {
      filtered = filtered.filter(exp => !exp.isSettlement);
    } else if (historyFilter === 'settlements') {
      filtered = filtered.filter(exp => exp.isSettlement);
    }

    // 3. Sort by Date (Newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 4. Group by Month
    const grouped = {};
    filtered.forEach(exp => {
      const date = new Date(exp.date);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(exp);
    });

    return grouped;
  };

  // --- UI කොටස ---
  return (
    <>
      <style>{styles}</style> 
      
      <div className="app-container">
        {!user ? (
          /* Login පිටුව */
          <div className="login-screen">
             <div className="logo-box">
               <Banknote color="white" size={32} />
             </div>
             <h2 className="title">Loan Balance</h2>
             <p style={{marginBottom: '30px', color: '#666'}}>Sri Lankan Expense Manager</p>
             
             <div style={{width: '100%'}}>
               <input 
                 placeholder="Mobile Number (077...)" 
                 className="input-field"
                 value={mobileInput} 
                 onChange={e => setMobileInput(e.target.value)} 
               />
               
               {!users.find(u => u.mobile === mobileInput) && mobileInput.length > 9 && (
                 <input 
                   placeholder="Your Name" 
                   className="input-field"
                   value={nameInput} 
                   onChange={e => setNameInput(e.target.value)} 
                 />
               )}
               
               <button onClick={handleLogin} className="btn-primary">
                 Login / Register
               </button>
             </div>
          </div>
        ) : (
          /* ඇප් එක ඇතුලත */
          <>
            <header className="header">
              {viewDetails ? (
                <div style={{display:'flex', alignItems:'center'}}>
                  <button onClick={() => setViewDetails(null)} className="back-btn"><ChevronLeft size={24}/></button>
                  <h1 className="font-bold">{viewDetails.data.name}</h1>
                </div>
              ) : (
                <div>
                  <h1 className="font-bold">Hi, {user.name}</h1>
                  <span className="text-muted">{user.mobile}</span>
                </div>
              )}
              
              {!viewDetails && (
                <button onClick={logout} className="btn-icon">
                  <LogOut size={20}/>
                </button>
              )}
            </header>
            
            <main className="main-content">
              {viewDetails ? (
                // Detailed View (Friend or Group)
                <div>
                   {viewDetails.type === 'friend' && (() => {
                      const friendBalances = balances.filter(item => item.otherUser.id === viewDetails.data.id);
                      const receiveItem = friendBalances.find(b => b.type === 'receive');
                      const payItem = friendBalances.find(b => b.type === 'pay');
                      
                      const receiveAmt = receiveItem ? receiveItem.amount : 0;
                      const payAmt = payItem ? payItem.amount : 0;

                      if (receiveAmt > 0 || payAmt > 0) {
                        return (
                          <div className="balance-card">
                            <div className="balance-total" style={{borderBottom: 'none', paddingBottom: '10px'}}>
                              <h4 style={{fontSize:'12px'}}>Total Balance with {viewDetails.data.name}</h4>
                            </div>
                            
                            <div className="balance-row" style={{marginBottom: '20px'}}>
                               <div style={{textAlign: 'center', flex: 1}}>
                                 <p className="label-receive" style={{justifyContent: 'center'}}><ArrowDownLeft size={12}/> To Receive</p>
                                 <p className="amount" style={{color: '#34d399'}}>LKR {receiveAmt.toFixed(0)}</p>
                                 {receiveAmt > 0 && (
                                    <button 
                                      onClick={(e) => openSettleModal(e, receiveItem)} 
                                      className="btn-outline" 
                                      style={{marginTop: '8px', fontSize:'10px', padding: '4px 12px', borderColor: '#059669', color: '#059669'}}
                                    >
                                      Settle
                                    </button>
                                 )}
                               </div>
                               
                               <div style={{width: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 10px'}}></div>
                               
                               <div style={{textAlign: 'center', flex: 1}}>
                                 <p className="label-pay" style={{justifyContent: 'center'}}>To Pay <ArrowUpRight size={12}/></p>
                                 <p className="amount" style={{color: '#fbbf24'}}>LKR {payAmt.toFixed(0)}</p>
                                 {payAmt > 0 && (
                                    <button 
                                      onClick={(e) => openSettleModal(e, payItem)} 
                                      className="btn-outline" 
                                      style={{marginTop: '8px', fontSize:'10px', padding: '4px 12px', borderColor: '#fbbf24', color: '#fbbf24'}}
                                    >
                                      Settle
                                    </button>
                                 )}
                               </div>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div className="balance-card" style={{textAlign:'center', padding:'30px'}}>
                           <p style={{color:'#9ca3af'}}>All settled up!</p>
                        </div>
                      );
                   })()}

                   <h3 style={{marginBottom: '15px', fontSize: '16px', marginTop:'10px'}}>Transaction History</h3>
                   {getDetailTransactions().length === 0 ? (
                     <p className="text-muted text-center" style={{marginTop:'30px'}}>No transactions yet.</p>
                   ) : (
                     getDetailTransactions().map(exp => renderTransactionItem(exp))
                   )}
                </div>
              ) : (
                <>
                  {view === 'dashboard' && (
                    <>
                      {/* Enhanced Net Balance Card */}
                      <div className="balance-card">
                        <div className="balance-total">
                          <h4>Net Balance</h4>
                          <h2 style={{ color: netBalance >= 0 ? '#10b981' : '#f87171' }}>
                            {netBalance >= 0 ? '+' : '-'} LKR {Math.abs(netBalance).toFixed(0)}
                          </h2>
                          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                            {netBalance >= 0 ? "You are owed overall" : "You owe overall"}
                          </p>
                        </div>
                        <div className="balance-row">
                           <div>
                             <p className="label-receive"><ArrowDownLeft size={12}/> To Receive</p>
                             <p className="amount" style={{color: '#34d399'}}>LKR {totalReceivable.toFixed(0)}</p>
                           </div>
                           <div>
                             <p className="label-pay">To Pay <ArrowUpRight size={12}/></p>
                             <p className="amount" style={{color: '#fbbf24'}}>LKR {totalPayable.toFixed(0)}</p>
                           </div>
                        </div>
                      </div>

                      {/* Split Lists: Owe vs Owed */}
                      
                      {/* You owe */}
                      {balances.some(b => b.type === 'pay') && (
                        <div>
                          <div className="section-title">You Owe (ඔබ ගෙවිය යුතු)</div>
                          {balances.filter(b => b.type === 'pay').map((b, i) => (
                            <div 
                              key={i} 
                              className="list-item"
                              onClick={() => setViewDetails({ type: 'friend', data: b.otherUser })}
                            >
                              <div className="user-info">
                                <div className="avatar" style={{backgroundColor: '#fff7ed', color:'#c2410c'}}>{b.otherUser?.name[0]}</div>
                                <div>
                                  <p className="font-bold">{b.otherUser?.name}</p>
                                </div>
                              </div>
                              <div style={{textAlign:'right'}}>
                                <p className="text-red">LKR {Math.abs(b.amount).toFixed(0)}</p>
                                <button 
                                  onClick={(e) => openSettleModal(e, b)} 
                                  className="btn-outline" 
                                  style={{marginTop: '4px', fontSize:'10px', padding: '4px 8px'}}
                                >
                                  Settle
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Owed to you */}
                      {balances.some(b => b.type === 'receive') && (
                        <div>
                          <div className="section-title">Owed to You (ඔබට ලැබිය යුතු)</div>
                          {balances.filter(b => b.type === 'receive').map((b, i) => (
                            <div 
                              key={i} 
                              className="list-item"
                              onClick={() => setViewDetails({ type: 'friend', data: b.otherUser })}
                            >
                              <div className="user-info">
                                <div className="avatar" style={{backgroundColor: '#ecfdf5', color:'#047857'}}>{b.otherUser?.name[0]}</div>
                                <div>
                                  <p className="font-bold">{b.otherUser?.name}</p>
                                </div>
                              </div>
                              <div style={{textAlign:'right'}}>
                                <p className="text-green">LKR {Math.abs(b.amount).toFixed(0)}</p>
                                <button 
                                  onClick={(e) => openSettleModal(e, b)} 
                                  className="btn-outline" 
                                  style={{marginTop: '4px', fontSize:'10px', padding: '4px 8px'}}
                                >
                                  Settle
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {balances.length === 0 && (
                        <div style={{textAlign:'center', padding:'40px 0', color:'#9ca3af'}}>
                          <Wallet size={48} style={{margin:'0 auto 10px', opacity:0.5}}/>
                          <p>No outstanding balances.</p>
                          <p style={{fontSize:'12px'}}>All settled up!</p>
                        </div>
                      )}

                      {/* Recent Activity Section */}
                      <div className="section-title" style={{marginTop:'30px'}}>Recent Activity</div>
                      {expenses.length > 0 ? (
                        expenses
                          .filter(exp => exp.involvedUsers && exp.involvedUsers.includes(user.id) || exp.payerId === user.id)
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .slice(0, 3) // Show only last 3
                          .map(exp => renderTransactionItem(exp))
                      ) : (
                        <p className="text-muted text-center" style={{fontSize:'12px'}}>No recent activity.</p>
                      )}
                      
                      <div style={{height:'20px'}}></div>
                    </>
                  )}

                  {view === 'add' && (
                     <div style={{marginTop: '20px'}}>
                       <h2 className="title" style={{marginBottom: '20px'}}>Add Expense</h2>
                       
                       <label className="text-muted">Amount (LKR)</label>
                       <input type="number" placeholder="0.00" className="big-input" id="amount" autoFocus />
                       
                       <label className="text-muted">For what?</label>
                       <input type="text" placeholder="Description (e.g. Dinner)" className="input-field" id="desc" />
                       
                       <div className="tab-container">
                         <button 
                           className={`tab-btn ${expenseType === 'group' ? 'active' : ''}`}
                           onClick={() => setExpenseType('group')}
                         >
                           <Users size={16} style={{display:'inline', marginRight:'5px', verticalAlign:'text-bottom'}}/>
                           Group
                         </button>
                         <button 
                           className={`tab-btn ${expenseType === 'personal' ? 'active' : ''}`}
                           onClick={() => setExpenseType('personal')}
                         >
                           <User size={16} style={{display:'inline', marginRight:'5px', verticalAlign:'text-bottom'}}/>
                           Friend
                         </button>
                       </div>
                       
                       {expenseType === 'personal' && (
                         <div style={{marginBottom: '16px'}}>
                            <label className="text-muted" style={{display:'block', marginBottom:'8px'}}>ගෙව්වේ කවුද? (Who Paid?)</label>
                            <div className="payer-toggle">
                              <button 
                                 className={`payer-btn ${paidByMe ? 'selected' : ''}`} 
                                 onClick={() => setPaidByMe(true)}
                              >
                                 මම (Me)
                              </button>
                              <button 
                                 className={`payer-btn ${!paidByMe ? 'selected' : ''}`} 
                                 onClick={() => setPaidByMe(false)}
                              >
                                 මිතුරා (Friend)
                              </button>
                            </div>
                         </div>
                       )}

                       <div 
                         className="split-toggle"
                         onClick={() => setIncludeMe(!includeMe)}
                       >
                         <div className={`checkbox ${includeMe ? 'checked' : ''}`}>
                           {includeMe && <Check size={14} color="white"/>}
                         </div>
                         <div style={{display:'flex', flexDirection:'column'}}>
                           <span style={{fontWeight:'bold', fontSize:'14px'}}>හවුලේ (Shared Split)</span>
                           <span style={{fontSize:'11px', color:'#6b7280'}}>
                             {includeMe 
                               ? "හැමෝම අතරේ සමව බෙදී යයි (50/50)" 
                               : (paidByMe ? "මම ගෙව්වා, සම්පූර්ණ මුදල අනිත් අයට ණයකි" : "මිතුරා ගෙව්වා, සම්පූර්ණ මුදල මම ණයයි")}
                           </span>
                         </div>
                       </div>

                       {expenseType === 'group' && (
                         <>
                           <label className="text-muted" style={{display:'block', marginBottom:'8px'}}>Select Group</label>
                           <div className="grid-2">
                             {groups.filter(g => g.members.includes(user.id)).map(g => (
                               <button key={g.id} onClick={() => {
                                  const amt = parseFloat(document.getElementById('amount').value);
                                  const desc = document.getElementById('desc').value;
                                  if(!amt || !desc) return alert('Please fill details');
                                  
                                  let involved = [...g.members];
                                  if (!includeMe) {
                                    involved = involved.filter(id => id !== user.id);
                                  }
                                  saveExpense(amt, desc, involved, user.id, g.id); // Passing g.id

                               }} className="btn-group">
                                 <Users size={16} className="text-muted"/>
                                 {g.name}
                               </button>
                             ))}
                           </div>
                           {groups.filter(g => g.members.includes(user.id)).length === 0 && (
                             <p className="text-muted text-center" style={{marginBottom: '20px'}}>No groups yet.</p>
                           )}
                         </>
                       )}

                       {expenseType === 'personal' && (
                         <>
                           <label className="text-muted" style={{display:'block', marginBottom:'8px'}}>Select Friend</label>
                           <div className="grid-2">
                             {getMyFriends().map(friend => (
                               <button key={friend.id} onClick={() => {
                                  const amt = parseFloat(document.getElementById('amount').value);
                                  const desc = document.getElementById('desc').value;
                                  if(!amt || !desc) return alert('Please fill details');
                                  
                                  const payerId = paidByMe ? user.id : friend.id;
                                  let involved = [user.id, friend.id]; 
                                  if (!includeMe) { 
                                     if (paidByMe) {
                                       involved = [friend.id];
                                     } else {
                                       involved = [user.id];
                                     }
                                  }
                                  saveExpense(amt, desc, involved, payerId);
                               }} className="btn-group">
                                 <User size={16} className="text-muted"/>
                                 {friend.name}
                               </button>
                             ))}
                           </div>
                           {getMyFriends().length === 0 && (
                             <p className="text-muted text-center" style={{marginBottom: '20px'}}>No friends added yet.</p>
                           )}
                         </>
                       )}
                       
                       <button onClick={() => setView('dashboard')} className="btn-cancel">Cancel</button>
                     </div>
                  )}

                  {view === 'friends' && (
                    <div style={{marginTop: '20px'}}>
                      <h2 className="title" style={{marginBottom: '20px'}}>Find Friends</h2>
                      <div className="search-box">
                        <input 
                          type="tel" 
                          placeholder="Enter mobile (e.g. 077...)" 
                          className="input-field"
                          style={{marginBottom: 0}}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button onClick={handleSearch} className="btn-primary" style={{width: 'auto'}}>
                          <Search size={20}/>
                        </button>
                      </div>

                      {searchResult && searchResult !== 'not_found' && (
                        <div className="search-result">
                          <div>
                            <p className="font-bold">{searchResult.name}</p>
                            <p className="text-muted">{searchResult.mobile}</p>
                          </div>
                          <button onClick={() => addFriend(searchResult.id)} className="btn-small">
                            Add Friend
                          </button>
                        </div>
                      )}
                      {searchResult === 'not_found' && (
                        <p className="text-red" style={{textAlign:'center', marginBottom:'20px'}}>User not found (මේ අංකය අපේ ලිස්ට් එකේ නැත)</p>
                      )}

                      <h3 style={{marginBottom: '10px', fontSize: '16px'}}>Your Friends</h3>
                      {getMyFriends().map(friendData => (
                        <div 
                          key={friendData.id} 
                          className="friend-card"
                          onClick={() => setViewDetails({ type: 'friend', data: friendData })}
                          style={{cursor:'pointer'}}
                        >
                            <div className="user-info">
                              <div className="avatar">{friendData?.name[0]}</div>
                              <div>
                                <p className="font-bold">{friendData?.name}</p>
                                <p className="text-muted">{friendData?.mobile}</p>
                              </div>
                            </div>
                            <span className="text-green" style={{fontSize: '12px'}}>View</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {view === 'groups' && (
                    <div style={{marginTop: '20px'}}>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px'}}>
                        <h2 className="title">Your Groups</h2>
                        <button onClick={() => setView('create_group')} className="btn-small">
                          + New Group
                        </button>
                      </div>

                      {groups.filter(g => g.members.includes(user.id)).map(g => (
                        <div 
                          key={g.id} 
                          className="list-item"
                          onClick={() => setViewDetails({ type: 'group', data: g })}
                        >
                          <div className="user-info">
                             <div className="avatar" style={{backgroundColor: '#ecfdf5', color: '#059669'}}>
                               <Users size={16}/>
                             </div>
                             <div>
                               <p className="font-bold">{g.name}</p>
                               <p className="text-muted">{g.members.length} Members</p>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {view === 'create_group' && (
                    <div style={{marginTop: '20px'}}>
                      <h2 className="title" style={{marginBottom: '20px'}}>Create Group</h2>
                      <label className="text-muted">Group Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Trip to Nuwara Eliya" 
                        className="input-field" 
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                      />
                      <label className="text-muted" style={{display:'block', marginBottom:'10px', marginTop:'20px'}}>
                        Select Friends to Add
                      </label>
                      <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                        {getMyFriends().map(friend => (
                          <div 
                            key={friend.id} 
                            className={`select-friend-row ${selectedFriendsForGroup.includes(friend.id) ? 'selected' : ''}`}
                            onClick={() => toggleFriendSelection(friend.id)}
                          >
                             <div className={`checkbox ${selectedFriendsForGroup.includes(friend.id) ? 'checked' : ''}`}>
                               {selectedFriendsForGroup.includes(friend.id) && <Check size={14} color="white"/>}
                             </div>
                             <span>{friend.name}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={handleCreateGroup} className="btn-primary" style={{marginTop: '20px'}}>Create Group</button>
                      <button onClick={() => setView('groups')} className="btn-cancel">Cancel</button>
                    </div>
                  )}

                  {view === 'history' && (
                    <div style={{marginTop: '20px'}}>
                      <h2 className="title" style={{marginBottom: '20px'}}>History (ඉතිහාසය)</h2>
                      <div className="tab-container" style={{marginBottom:'20px'}}>
                         <button className={`tab-btn ${historyFilter === 'all' ? 'active' : ''}`} onClick={() => setHistoryFilter('all')}>All</button>
                         <button className={`tab-btn ${historyFilter === 'expenses' ? 'active' : ''}`} onClick={() => setHistoryFilter('expenses')}>Expenses</button>
                         <button className={`tab-btn ${historyFilter === 'settlements' ? 'active' : ''}`} onClick={() => setHistoryFilter('settlements')}>Settlements</button>
                      </div>
                      {(() => {
                          const historyData = getFilteredHistory();
                          const months = Object.keys(historyData);
                          
                          if (months.length === 0) {
                              return <p className="text-muted text-center" style={{marginTop: '30px'}}>No history yet.</p>;
                          }

                          return months.map(month => (
                              <div key={month}>
                                <div className="month-header">{month}</div>
                                {historyData[month].map(exp => renderTransactionItem(exp))}
                              </div>
                          ));
                      })()}
                    </div>
                  )}
                </>
              )}
            </main>

            {!viewDetails && (
              <nav className="bottom-nav">
                <button onClick={() => setView('dashboard')} className={`nav-item ${view==='dashboard'?'active':''}`}>
                  <Home size={24}/>
                  <span className="nav-text">Home</span>
                </button>
                <button onClick={() => setView('groups')} className={`nav-item ${view==='groups'?'active':''}`}>
                  <Users size={24}/>
                  <span className="nav-text">Groups</span>
                </button>
                <button onClick={() => setView('add')} className="fab-btn"><Plus size={28}/></button>
                <button onClick={() => setView('history')} className={`nav-item ${view==='history'?'active':''}`}>
                  <History size={24}/>
                  <span className="nav-text">History</span>
                </button>
                <button onClick={() => setView('friends')} className={`nav-item ${view==='friends'?'active':''}`}>
                  <User size={24}/>
                  <span className="nav-text">Friends</span>
                </button>
              </nav>
            )}

            {settleUser && (
              <div className="modal-overlay" onClick={() => setSettleUser(null)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                   <h2 className="title" style={{textAlign:'center', marginBottom:'10px'}}>
                     {settleUser.type === 'receive' ? `Receive from ${settleUser.name}` : `Pay ${settleUser.name}`}
                   </h2>
                   <p className="text-muted" style={{textAlign:'center', marginBottom:'20px'}}>
                      {settleUser.type === 'receive' ? "ඔබට ලැබුණු මුදල සටහන් කරන්න" : "ඔබ ගෙවූ මුදල සටහන් කරන්න"}
                   </p>
                   <label className="text-muted">Amount (LKR)</label>
                   <input type="number" id="settleAmount" defaultValue={settleUser.amount} className="big-input" autoFocus />
                   <button onClick={confirmSettlement} className="btn-primary">
                     {settleUser.type === 'receive' ? "Received (ලැබුණා)" : "Paid (ගෙව්වා)"}
                   </button>
                   <button onClick={() => setSettleUser(null)} className="btn-cancel">Cancel</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
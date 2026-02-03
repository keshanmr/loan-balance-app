import React, { useState, useMemo, useEffect } from 'react';
import { 
  User, Users, Plus, LogOut, Search, 
  Check, X, Banknote, ArrowUpRight, ArrowDownLeft, Home, UserPlus, HandCoins, History, Filter, ChevronLeft, Wallet, ShieldCheck
} from 'lucide-react';

// --- FIREBASE SETUP ---
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, doc, setDoc, query, orderBy, where } from 'firebase/firestore';

// TODO: ඔබේ Firebase Console එකෙන් ලැබෙන Config එක මෙතැනට Paste කරන්න
const firebaseConfig = {
  apiKey: "AIzaSyDWBulE-srC3cJcQ50IaISMAZEISh8MmeU",
  authDomain: "loan-balance-app.firebaseapp.com",
  projectId: "loan-balance-app",
  storageBucket: "loan-balance-app.firebasestorage.app",
  messagingSenderId: "1061180274954",
  appId: "1:1061180274954:web:fb7fa0aa5b98acfb1222f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- ADMIN CONFIG ---
const ADMIN_MOBILE = '0771724915'; // මෙම අංකය ඇඩ්මින් ලෙස ක්‍රියා කරයි

// --- CSS Styles ---
const styles = `
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #f3f4f6; }
  .app-container { max-width: 450px; margin: 0 auto; background-color: #f9fafb; min-height: 100vh; box-shadow: 0 10px 25px rgba(0,0,0,0.1); position: relative; padding-bottom: 80px; }
  .login-screen { display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; text-align: center; }
  .logo-box { background-color: #059669; width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; margin-left: auto; margin-right: auto; }
  .title { font-size: 24px; font-weight: bold; color: #1f2937; margin: 0; }
  .input-field { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; margin-bottom: 12px; font-size: 16px; box-sizing: border-box; }
  .btn-primary { width: 100%; background-color: #059669; color: white; padding: 12px; border: none; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer; transition: background-color 0.2s; }
  .btn-primary:hover { background-color: #047857; }
  .header { background-color: white; padding: 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 10; }
  .btn-icon { background: none; border: none; cursor: pointer; color: #6b7280; }
  .main-content { padding: 16px; }
  .balance-card { background: linear-gradient(135deg, #1f2937 0%, #111827 100%); color: white; padding: 24px; border-radius: 20px; margin-bottom: 24px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
  .balance-total { text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .balance-total h4 { margin: 0; font-size: 14px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; }
  .balance-total h2 { margin: 5px 0 0 0; font-size: 32px; font-weight: 800; }
  .balance-row { display: flex; justify-content: space-between; }
  .label-receive { color: #6ee7b7; font-size: 12px; margin-bottom: 4px; display: flex; align-items: center; gap: 4px; }
  .label-pay { color: #fdba74; font-size: 12px; margin-bottom: 4px; text-align: right; display: flex; align-items: center; justify-content: flex-end; gap: 4px; }
  .amount { font-size: 20px; font-weight: bold; margin: 0; }
  .section-title { font-size: 14px; font-weight: 700; color: #6b7280; margin: 24px 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; }
  .list-item { background-color: white; padding: 16px; border-radius: 12px; border: 1px solid #f3f4f6; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05); cursor: pointer; transition: background-color 0.2s; }
  .list-item:hover { background-color: #f9fafb; }
  .user-info { display: flex; align-items: center; gap: 12px; }
  .avatar { width: 32px; height: 32px; background-color: #f3f4f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; color: #374151; }
  .text-green { color: #059669; font-weight: bold; }
  .text-red { color: #ea580c; font-weight: bold; }
  .text-muted { color: #6b7280; font-size: 12px; }
  .big-input { width: 100%; font-size: 30px; font-weight: bold; padding: 16px; border: 2px solid #e5e7eb; border-radius: 12px; margin-bottom: 12px; box-sizing: border-box; }
  .tab-container { display: flex; background-color: #e5e7eb; padding: 4px; border-radius: 10px; margin-bottom: 16px; }
  .tab-btn { flex: 1; padding: 10px; border: none; border-radius: 8px; background: transparent; color: #6b7280; font-weight: 600; cursor: pointer; }
  .tab-btn.active { background-color: white; color: #059669; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
  .split-toggle { display: flex; align-items: center; background: white; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 16px; cursor: pointer; }
  .split-toggle:hover { background-color: #f9fafb; }
  .payer-toggle { display: flex; gap: 10px; margin-bottom: 16px; }
  .payer-btn { flex: 1; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; background: white; color: #6b7280; cursor: pointer; font-size: 14px; }
  .payer-btn.selected { background-color: #1f2937; color: white; border-color: #1f2937; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
  .btn-group { padding: 12px; border: 1px solid #e5e7eb; background: white; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .btn-group:hover { background-color: #ecfdf5; }
  .btn-cancel { width: 100%; padding: 12px; background: none; border: none; color: #6b7280; cursor: pointer; margin-top: 8px; }
  .btn-outline { background: white; border: 1px solid #d1d5db; color: #374151; padding: 8px 12px; border-radius: 6px; font-weight: 600; font-size: 12px; cursor: pointer; }
  .btn-outline:hover { background-color: #f3f4f6; }
  .search-box { display: flex; gap: 8px; margin-bottom: 20px; }
  .friend-card { background: white; padding: 12px; border-radius: 12px; border: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .btn-small { background-color: #059669; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; border: none; cursor: pointer; font-weight: bold; }
  .search-result { background-color: #ecfdf5; border: 1px solid #059669; padding: 12px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
  .select-friend-row { display: flex; align-items: center; padding: 12px; background: white; border: 1px solid #f3f4f6; margin-bottom: 8px; border-radius: 8px; cursor: pointer; }
  .select-friend-row.selected { border-color: #059669; background-color: #ecfdf5; }
  .checkbox { width: 20px; height: 20px; border: 2px solid #d1d5db; border-radius: 6px; margin-right: 12px; display: flex; align-items: center; justify-content: center; }
  .checkbox.checked { background-color: #059669; border-color: #059669; }
  .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 50; padding: 20px; }
  .modal { background: white; padding: 24px; border-radius: 16px; width: 100%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); animation: fadeIn 0.2s ease-out; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .history-item { background: white; padding: 12px; border-radius: 12px; border: 1px solid #f3f4f6; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start; }
  .history-date { font-size: 10px; color: #9ca3af; margin-top: 4px; }
  .history-desc { font-weight: 600; font-size: 14px; color: #374151; }
  .history-payer { font-size: 11px; color: #6b7280; }
  .tag-settle { background-color: #dbeafe; color: #1e40af; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-right: 6px; font-weight: 600; }
  .tag-group { background-color: #f3f4f6; color: #4b5563; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-right: 6px; font-weight: 600; border: 1px solid #e5e7eb; }
  .month-header { font-size: 12px; font-weight: 700; color: #6b7280; margin: 20px 0 10px 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .detail-header { display: flex; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; }
  .back-btn { background: none; border: none; cursor: pointer; margin-right: 10px; color: #374151; }
  .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; max-width: 450px; margin: 0 auto; background-color: white; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-around; padding: 12px 0; z-index: 20; }
  .nav-item { display: flex; flex-direction: column; align-items: center; background: none; border: none; color: #9ca3af; cursor: pointer; }
  .nav-item.active { color: #059669; }
  .nav-text { font-size: 10px; margin-top: 4px; }
  .fab-btn { background-color: #059669; color: white; width: 56px; height: 56px; border-radius: 50%; border: none; position: relative; top: -24px; box-shadow: 0 4px 10px rgba(5, 150, 105, 0.4); display: flex; align-items: center; justify-content: center; cursor: pointer; }
`;

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Admin State
  const [view, setView] = useState('auth'); 
  
  // Real-time Data States
  const [users, setUsers] = useState([]);
  const [friendships, setFriendships] = useState([]);
  const [groups, setGroups] = useState([]);
  const [expenses, setExpenses] = useState([]);
  
  // Inputs
  const [mobileInput, setMobileInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedFriendsForGroup, setSelectedFriendsForGroup] = useState([]);
  const [expenseType, setExpenseType] = useState('group');
  const [includeMe, setIncludeMe] = useState(true);
  const [paidByMe, setPaidByMe] = useState(true);
  const [settleUser, setSettleUser] = useState(null);
  const [historyFilter, setHistoryFilter] = useState('all'); 
  const [viewDetails, setViewDetails] = useState(null);

  // Admin Inputs
  const [adminUserMobile, setAdminUserMobile] = useState('');
  const [adminUserName, setAdminUserName] = useState('');

  // --- FIREBASE REALTIME LISTENERS & NOTIFICATIONS ---
  useEffect(() => {
    // Other listeners (Users, Friends, Groups)
    const unsubUsers = onSnapshot(collection(db, "users"), (s) => setUsers(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubFriends = onSnapshot(collection(db, "friendships"), (s) => setFriendships(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubGroups = onSnapshot(collection(db, "groups"), (s) => setGroups(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    
    // Expenses Listener with Notification Logic
    let isInitial = true;
    const unsubExpenses = onSnapshot(collection(db, "expenses"), (snapshot) => {
      const loadedExpenses = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setExpenses(loadedExpenses);

      // Notification Logic
      if (!isInitial && user) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            
            // Check if I am involved AND I am NOT the payer
            if (data.involvedUsers && data.involvedUsers.includes(user.id) && data.payerId !== user.id) {
               const payer = users.find(u => u.id === data.payerId);
               const payerName = payer ? payer.name : "Someone";
               
               let title = "New Transaction";
               let body = "";
               
               if (data.isSettlement) {
                 title = "💰 මුදල් ලැබුණා!";
                 body = `${payerName} විසින් ඔබට රු. ${data.amount} ගෙවන ලදී.`;
               } else {
                 title = "📝 අලුත් වියදමක්";
                 body = `${payerName} විසින් '${data.description}' (රු. ${data.amount}) එකතු කරන ලදී.`;
               }

               if (Notification.permission === "granted") {
                 new Notification(title, { body, icon: '/vite.svg' });
               }
            }
          }
        });
      }
      isInitial = false;
    });

    return () => { unsubUsers(); unsubFriends(); unsubGroups(); unsubExpenses(); };
  }, [user, users]); // Re-run if user/users change

  // --- Calculations ---
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

       if (finalReceive > 1) result.push({ otherUser: u, amount: finalReceive, type: 'receive' });
       if (finalPay > 1) result.push({ otherUser: u, amount: finalPay, type: 'pay' });
    });
    
    return result.sort((a, b) => b.amount - a.amount);
  }, [expenses, user, users]);

  const totalReceivable = balances.filter(b => b.type === 'receive').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPayable = balances.filter(b => b.type === 'pay').reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalReceivable - totalPayable;

  // --- Functions ---
  const handleLogin = async () => {
    if (!mobileInput) return;
    
    // Request Notification Permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }
    
    // Check if user exists
    let currentUser = users.find(u => u.mobile === mobileInput);
    
    if (!currentUser) {
      if (!nameInput) return alert('කරුණාකර ඔබේ නම ඇතුලත් කරන්න');
      const newUserId = `u${Date.now()}`;
      currentUser = { name: nameInput, mobile: mobileInput, createdAt: new Date().toISOString() };
      await setDoc(doc(db, "users", newUserId), currentUser);
      currentUser.id = newUserId;
    }
    
    localStorage.setItem('podu_current_user_mobile', mobileInput);
    setUser(currentUser);
    
    // Check Admin Status
    if (mobileInput === ADMIN_MOBILE) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    setView('dashboard');
  };

  // Auto Login
  useEffect(() => {
    const savedMobile = localStorage.getItem('podu_current_user_mobile');
    if (savedMobile && users.length > 0 && !user) {
      const foundUser = users.find(u => u.mobile === savedMobile);
      if (foundUser) {
        setUser(foundUser);
        if (savedMobile === ADMIN_MOBILE) setIsAdmin(true);
        setView('dashboard');
      }
    }
  }, [users]);

  const logout = () => {
    localStorage.removeItem('podu_current_user_mobile');
    setUser(null);
    setIsAdmin(false);
    setView('auth');
  };

  const handleSearch = () => {
    if(!searchQuery) return;
    const found = users.find(u => u.mobile === searchQuery && u.id !== user.id);
    setSearchResult(found || 'not_found');
  };

  const addFriend = async (friendId) => {
    const exists = friendships.find(f => (f.userId === user.id && f.friendId === friendId) || (f.userId === friendId && f.friendId === user.id));
    if(exists) return alert('Already added.');
    await addDoc(collection(db, "friendships"), { userId: user.id, friendId: friendId, status: 'accepted', createdAt: new Date().toISOString() });
    setSearchResult(null); setSearchQuery(''); alert('Added!');
  };

  const handleCreateGroup = async () => {
    if (!newGroupName || selectedFriendsForGroup.length === 0) return alert('Fill all details');
    await addDoc(collection(db, "groups"), { name: newGroupName, createdBy: user.id, members: [user.id, ...selectedFriendsForGroup], createdAt: new Date().toISOString() });
    setNewGroupName(''); setSelectedFriendsForGroup([]); setView('groups'); alert('Group Created!');
  };

  const saveExpense = async (amt, desc, involvedMembers, specificPayerId, groupId = null) => {
      await addDoc(collection(db, "expenses"), { amount: amt, description: desc, payerId: specificPayerId || user.id, involvedUsers: involvedMembers, groupId: groupId, date: new Date().toISOString() });
      setIncludeMe(true); setPaidByMe(true); setView('dashboard');
  };

  const confirmSettlement = async () => {
     if (!settleUser) return;
     const amt = parseFloat(document.getElementById('settleAmount').value);
     if (!amt || amt <= 0) return alert('Invalid amount');
     let payerId, involvedUsers;
     if (settleUser.type === 'receive') { payerId = settleUser.id; involvedUsers = [user.id]; } 
     else { payerId = user.id; involvedUsers = [settleUser.id]; }
     await addDoc(collection(db, "expenses"), { amount: amt, description: "Settlement", payerId: payerId, involvedUsers: involvedUsers, date: new Date().toISOString(), isSettlement: true });
     setSettleUser(null); alert('Settled!');
  };

  // --- Admin Functions ---
  const handleAdminCreateUser = async () => {
    if (!adminUserName || !adminUserMobile) return alert("නම සහ දුරකථන අංකය ඇතුලත් කරන්න");
    
    // Check if mobile already exists
    const existing = users.find(u => u.mobile === adminUserMobile);
    if (existing) return alert("මෙම දුරකථන අංකය දැනටමත් ලියාපදිංචි වී ඇත.");

    const newUserId = `u${Date.now()}`;
    const newUser = { 
      name: adminUserName, 
      mobile: adminUserMobile, 
      createdAt: new Date().toISOString() 
    };
    
    await setDoc(doc(db, "users", newUserId), newUser);
    setAdminUserName('');
    setAdminUserMobile('');
    alert(`සාමාජිකයා එකතු කරන ලදී: ${adminUserName}`);
  };

  const getMyFriends = () => friendships.filter(f => f.userId === user.id || f.friendId === user.id).map(f => {
      const friendId = f.userId === user.id ? f.friendId : f.userId;
      return users.find(u => u.id === friendId);
  });

  const toggleFriendSelection = (id) => selectedFriendsForGroup.includes(id) ? setSelectedFriendsForGroup(selectedFriendsForGroup.filter(i => i !== id)) : setSelectedFriendsForGroup([...selectedFriendsForGroup, id]);

  const openSettleModal = (e, b) => { e.stopPropagation(); setSettleUser({ id: b.otherUser.id, name: b.otherUser.name, amount: b.amount, type: b.type }); };

  const getDetailTransactions = () => {
    if (!viewDetails) return [];
    let filtered = [];
    if (viewDetails.type === 'friend') {
      const friendId = viewDetails.data.id;
      filtered = expenses.filter(exp => (exp.payerId === user.id && exp.involvedUsers.includes(friendId)) || (exp.payerId === friendId && exp.involvedUsers.includes(user.id)));
    } else if (viewDetails.type === 'group') {
      filtered = expenses.filter(exp => exp.groupId === viewDetails.data.id);
    }
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const renderTransactionItem = (exp) => {
    const isPayer = exp.payerId === user.id;
    const payerName = isPayer ? "You" : users.find(u => u.id === exp.payerId)?.name || "Unknown";
    const group = groups.find(g => g.id === exp.groupId);
    
    let amountVal = exp.amount;
    if (viewDetails?.type === 'friend' && !exp.isSettlement) amountVal = exp.amount / exp.involvedUsers.length;
    
    let amountDisplay = `LKR ${amountVal.toFixed(0)}`;
    let colorStyle = '#374151';

    if (exp.isSettlement) {
      if (isPayer) { amountDisplay = `- LKR ${amountVal.toFixed(0)}`; colorStyle = '#ea580c'; } 
      else { amountDisplay = `+ LKR ${amountVal.toFixed(0)}`; colorStyle = '#059669'; }
    } else {
        amountDisplay = `- LKR ${amountVal.toFixed(0)}`;
        colorStyle = isPayer ? '#ea580c' : '#7c3aed';
    }

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
          <p className="history-payer">{subText} • {new Date(exp.date).toLocaleDateString()}</p>
        </div>
        <div style={{textAlign:'right'}}>
          <p style={{fontWeight:'bold', color: colorStyle}}>{amountDisplay}</p>
        </div>
      </div>
    );
  };

  const getFilteredHistory = () => {
    let filtered = expenses.filter(exp => (exp.involvedUsers && exp.involvedUsers.includes(user.id)) || exp.payerId === user.id);
    if (historyFilter === 'expenses') filtered = filtered.filter(exp => !exp.isSettlement);
    else if (historyFilter === 'settlements') filtered = filtered.filter(exp => exp.isSettlement);
    
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    const grouped = {};
    filtered.forEach(exp => {
      const monthYear = new Date(exp.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!grouped[monthYear]) grouped[monthYear] = [];
      grouped[monthYear].push(exp);
    });
    return grouped;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        {!user ? (
          <div className="login-screen">
             <div className="logo-box"><Banknote color="white" size={32} /></div>
             <h2 className="title">Loan Balance</h2>
             <p style={{marginBottom: '30px', color: '#666'}}>Sri Lankan Expense Manager</p>
             <div style={{width: '100%'}}>
               <input placeholder="Mobile Number" className="input-field" value={mobileInput} onChange={e => setMobileInput(e.target.value)} />
               {!users.find(u => u.mobile === mobileInput) && mobileInput.length > 9 && <input placeholder="Your Name" className="input-field" value={nameInput} onChange={e => setNameInput(e.target.value)} />}
               <button onClick={handleLogin} className="btn-primary">Login / Register</button>
             </div>
          </div>
        ) : (
          <>
            <header className="header">
              {viewDetails ? (
                <div style={{display:'flex', alignItems:'center'}}><button onClick={() => setViewDetails(null)} className="back-btn"><ChevronLeft size={24}/></button><h1 className="font-bold">{viewDetails.data.name}</h1></div>
              ) : (
                <div>
                  <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <h1 className="font-bold">Hi, {user.name}</h1>
                    {isAdmin && <span style={{backgroundColor:'#e0f2fe', color:'#0284c7', padding:'2px 6px', borderRadius:'4px', fontSize:'10px', fontWeight:'bold'}}>ADMIN</span>}
                  </div>
                  <span className="text-muted">{user.mobile}</span>
                </div>
              )}
              {!viewDetails && <button onClick={logout} className="btn-icon"><LogOut size={20}/></button>}
            </header>
            
            <main className="main-content">
              {viewDetails ? (
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
                            <div className="balance-total" style={{borderBottom: 'none', paddingBottom: '10px'}}><h4 style={{fontSize:'12px'}}>Balance with {viewDetails.data.name}</h4></div>
                            <div className="balance-row" style={{marginBottom: '20px'}}>
                               <div style={{textAlign: 'center', flex: 1}}>
                                 <p className="label-receive" style={{justifyContent: 'center'}}><ArrowDownLeft size={12}/> To Receive</p>
                                 <p className="amount" style={{color: '#34d399'}}>LKR {receiveAmt.toFixed(0)}</p>
                                 {receiveAmt > 0 && <button onClick={(e) => openSettleModal(e, receiveItem)} className="btn-outline" style={{marginTop: '8px', fontSize:'10px', padding: '4px 12px', borderColor: '#059669', color: '#059669'}}>Settle</button>}
                               </div>
                               <div style={{width: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 10px'}}></div>
                               <div style={{textAlign: 'center', flex: 1}}>
                                 <p className="label-pay" style={{justifyContent: 'center'}}>To Pay <ArrowUpRight size={12}/></p>
                                 <p className="amount" style={{color: '#fbbf24'}}>LKR {payAmt.toFixed(0)}</p>
                                 {payAmt > 0 && <button onClick={(e) => openSettleModal(e, payItem)} className="btn-outline" style={{marginTop: '8px', fontSize:'10px', padding: '4px 12px', borderColor: '#fbbf24', color: '#fbbf24'}}>Settle</button>}
                               </div>
                            </div>
                          </div>
                        );
                      }
                      return <div className="balance-card" style={{textAlign:'center', padding:'30px'}}><p style={{color:'#9ca3af'}}>All settled up!</p></div>;
                   })()}
                   <h3 style={{marginBottom: '15px', fontSize: '16px', marginTop:'10px'}}>Transaction History</h3>
                   {getDetailTransactions().length === 0 ? <p className="text-muted text-center" style={{marginTop:'30px'}}>No transactions yet.</p> : getDetailTransactions().map(exp => renderTransactionItem(exp))}
                </div>
              ) : (
                <>
                  {view === 'dashboard' && (
                    <>
                      <div className="balance-card">
                        <div className="balance-total">
                          <h4>Net Balance</h4>
                          <h2 style={{ color: netBalance >= 0 ? '#10b981' : '#f87171' }}>{netBalance >= 0 ? '+' : '-'} LKR {Math.abs(netBalance).toFixed(0)}</h2>
                          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{netBalance >= 0 ? "You are owed overall" : "You owe overall"}</p>
                        </div>
                        <div className="balance-row">
                           <div><p className="label-receive"><ArrowDownLeft size={12}/> To Receive</p><p className="amount" style={{color: '#34d399'}}>LKR {totalReceivable.toFixed(0)}</p></div>
                           <div><p className="label-pay">To Pay <ArrowUpRight size={12}/></p><p className="amount" style={{color: '#fbbf24'}}>LKR {totalPayable.toFixed(0)}</p></div>
                        </div>
                      </div>
                      {balances.some(b => b.type === 'pay') && (
                        <div><div className="section-title">You Owe</div>{balances.filter(b => b.type === 'pay').map((b, i) => (<div key={i} className="list-item" onClick={() => setViewDetails({ type: 'friend', data: b.otherUser })}><div className="user-info"><div className="avatar" style={{backgroundColor: '#fff7ed', color:'#c2410c'}}>{b.otherUser?.name[0]}</div><p className="font-bold">{b.otherUser?.name}</p></div><div style={{textAlign:'right'}}><p className="text-red">LKR {Math.abs(b.amount).toFixed(0)}</p><button onClick={(e) => openSettleModal(e, b)} className="btn-outline" style={{marginTop: '4px', fontSize:'10px', padding: '4px 8px'}}>Settle</button></div></div>))}</div>
                      )}
                      {balances.some(b => b.type === 'receive') && (
                        <div><div className="section-title">Owed to You</div>{balances.filter(b => b.type === 'receive').map((b, i) => (<div key={i} className="list-item" onClick={() => setViewDetails({ type: 'friend', data: b.otherUser })}><div className="user-info"><div className="avatar" style={{backgroundColor: '#ecfdf5', color:'#047857'}}>{b.otherUser?.name[0]}</div><p className="font-bold">{b.otherUser?.name}</p></div><div style={{textAlign:'right'}}><p className="text-green">LKR {Math.abs(b.amount).toFixed(0)}</p><button onClick={(e) => openSettleModal(e, b)} className="btn-outline" style={{marginTop: '4px', fontSize:'10px', padding: '4px 8px'}}>Settle</button></div></div>))}</div>
                      )}
                      {balances.length === 0 && <div style={{textAlign:'center', padding:'40px 0', color:'#9ca3af'}}><Wallet size={48} style={{margin:'0 auto 10px', opacity:0.5}}/><p>No outstanding balances.</p></div>}
                      <div className="section-title" style={{marginTop:'30px'}}>Recent Activity</div>
                      {expenses.length > 0 ? expenses.filter(exp => exp.involvedUsers && exp.involvedUsers.includes(user.id) || exp.payerId === user.id).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3).map(exp => renderTransactionItem(exp)) : <p className="text-muted text-center" style={{fontSize:'12px'}}>No recent activity.</p>}
                      <div style={{height:'20px'}}></div>
                    </>
                  )}

                  {view === 'admin_panel' && (
                    <div style={{marginTop: '20px'}}>
                      <h2 className="title" style={{marginBottom: '20px'}}>පරිපාලක මණ්ඩලය (Admin)</h2>
                      <div style={{backgroundColor:'white', padding:'20px', borderRadius:'16px', border:'1px solid #d1d5db'}}>
                        <h3 style={{fontSize:'16px', fontWeight:'bold', marginBottom:'15px', color:'#059669'}}>නව සාමාජිකයෙක් එකතු කරන්න</h3>
                        <label className="text-muted">නම (Name)</label>
                        <input type="text" className="input-field" value={adminUserName} onChange={(e) => setAdminUserName(e.target.value)} placeholder="User Name" />
                        <label className="text-muted">දුරකථන අංකය (Mobile)</label>
                        <input type="tel" className="input-field" value={adminUserMobile} onChange={(e) => setAdminUserMobile(e.target.value)} placeholder="07xxxxxxxx" />
                        <button onClick={handleAdminCreateUser} className="btn-primary" style={{marginTop:'10px'}}>Create User</button>
                      </div>
                      
                      <div style={{marginTop:'30px'}}>
                        <h3 className="section-title">සියලුම සාමාජිකයන් ({users.length})</h3>
                        {users.map(u => (
                          <div key={u.id} style={{padding:'10px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between'}}>
                            <span style={{fontWeight:'bold'}}>{u.name}</span>
                            <span style={{color:'#6b7280', fontSize:'12px'}}>{u.mobile}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {view === 'add' && (
                     <div style={{marginTop: '20px'}}>
                       <h2 className="title" style={{marginBottom: '20px'}}>Add Expense</h2>
                       <label className="text-muted">Amount (LKR)</label>
                       <input type="number" placeholder="0.00" className="big-input" id="amount" autoFocus />
                       <label className="text-muted">For what?</label>
                       <input type="text" placeholder="Description" className="input-field" id="desc" />
                       <div className="tab-container">
                         <button className={`tab-btn ${expenseType === 'group' ? 'active' : ''}`} onClick={() => setExpenseType('group')}><Users size={16} style={{display:'inline', marginRight:'5px', verticalAlign:'text-bottom'}}/>Group</button>
                         <button className={`tab-btn ${expenseType === 'personal' ? 'active' : ''}`} onClick={() => setExpenseType('personal')}><User size={16} style={{display:'inline', marginRight:'5px', verticalAlign:'text-bottom'}}/>Friend</button>
                       </div>
                       {expenseType === 'personal' && (
                         <div style={{marginBottom: '16px'}}>
                            <label className="text-muted" style={{display:'block', marginBottom:'8px'}}>Who Paid?</label>
                            <div className="payer-toggle">
                              <button className={`payer-btn ${paidByMe ? 'selected' : ''}`} onClick={() => setPaidByMe(true)}>Me</button>
                              <button className={`payer-btn ${!paidByMe ? 'selected' : ''}`} onClick={() => setPaidByMe(false)}>Friend</button>
                            </div>
                         </div>
                       )}
                       <div className="split-toggle" onClick={() => setIncludeMe(!includeMe)}>
                         <div className={`checkbox ${includeMe ? 'checked' : ''}`}>{includeMe && <Check size={14} color="white"/>}</div>
                         <div style={{display:'flex', flexDirection:'column'}}><span style={{fontWeight:'bold', fontSize:'14px'}}>Shared Split</span><span style={{fontSize:'11px', color:'#6b7280'}}>{includeMe ? "Split equally" : (paidByMe ? "Full amount owed to me" : "Full amount I owe")}</span></div>
                       </div>
                       {expenseType === 'group' && (
                         <>
                           <label className="text-muted" style={{display:'block', marginBottom:'8px'}}>Select Group</label>
                           <div className="grid-2">{groups.filter(g => g.members.includes(user.id)).map(g => <button key={g.id} onClick={() => { const amt = parseFloat(document.getElementById('amount').value); const desc = document.getElementById('desc').value; if(!amt || !desc) return alert('Fill details'); let involved = [...g.members]; if (!includeMe) involved = involved.filter(id => id !== user.id); saveExpense(amt, desc, involved, user.id, g.id); }} className="btn-group"><Users size={16} className="text-muted"/>{g.name}</button>)}</div>
                         </>
                       )}
                       {expenseType === 'personal' && (
                         <>
                           <label className="text-muted" style={{display:'block', marginBottom:'8px'}}>Select Friend</label>
                           <div className="grid-2">{getMyFriends().map(friend => <button key={friend.id} onClick={() => { const amt = parseFloat(document.getElementById('amount').value); const desc = document.getElementById('desc').value; if(!amt || !desc) return alert('Fill details'); const payerId = paidByMe ? user.id : friend.id; let involved = [user.id, friend.id]; if (!includeMe) { if (paidByMe) involved = [friend.id]; else involved = [user.id]; } saveExpense(amt, desc, involved, payerId); }} className="btn-group"><User size={16} className="text-muted"/>{friend.name}</button>)}</div>
                         </>
                       )}
                       <button onClick={() => setView('dashboard')} className="btn-cancel">Cancel</button>
                     </div>
                  )}

                  {view === 'friends' && (
                    <div style={{marginTop: '20px'}}>
                      <h2 className="title" style={{marginBottom: '20px'}}>Find Friends</h2>
                      <div className="search-box"><input type="tel" placeholder="Mobile Number" className="input-field" style={{marginBottom: 0}} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /><button onClick={handleSearch} className="btn-primary" style={{width: 'auto'}}><Search size={20}/></button></div>
                      {searchResult && searchResult !== 'not_found' && <div className="search-result"><div><p className="font-bold">{searchResult.name}</p><p className="text-muted">{searchResult.mobile}</p></div><button onClick={() => addFriend(searchResult.id)} className="btn-small">Add Friend</button></div>}
                      {searchResult === 'not_found' && <p className="text-red" style={{textAlign:'center', marginBottom:'20px'}}>User not found</p>}
                      <h3 style={{marginBottom: '10px', fontSize: '16px'}}>Your Friends</h3>
                      {getMyFriends().map(friendData => <div key={friendData.id} className="friend-card" onClick={() => setViewDetails({ type: 'friend', data: friendData })} style={{cursor:'pointer'}}><div className="user-info"><div className="avatar">{friendData?.name[0]}</div><div><p className="font-bold">{friendData?.name}</p><p className="text-muted">{friendData?.mobile}</p></div></div><span className="text-green" style={{fontSize: '12px'}}>View</span></div>)}
                    </div>
                  )}

                  {view === 'groups' && (
                    <div style={{marginTop: '20px'}}>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px'}}><h2 className="title">Your Groups</h2><button onClick={() => setView('create_group')} className="btn-small">+ New Group</button></div>
                      {groups.filter(g => g.members.includes(user.id)).map(g => <div key={g.id} className="list-item" onClick={() => setViewDetails({ type: 'group', data: g })}><div className="user-info"><div className="avatar" style={{backgroundColor: '#ecfdf5', color: '#059669'}}><Users size={16}/></div><div><p className="font-bold">{g.name}</p><p className="text-muted">{g.members.length} Members</p></div></div></div>)}
                    </div>
                  )}

                  {view === 'create_group' && (
                    <div style={{marginTop: '20px'}}>
                      <h2 className="title" style={{marginBottom: '20px'}}>Create Group</h2>
                      <label className="text-muted">Group Name</label><input type="text" placeholder="e.g. Trip" className="input-field" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
                      <label className="text-muted" style={{display:'block', marginBottom:'10px', marginTop:'20px'}}>Select Friends</label>
                      <div style={{maxHeight: '300px', overflowY: 'auto'}}>{getMyFriends().map(friend => <div key={friend.id} className={`select-friend-row ${selectedFriendsForGroup.includes(friend.id) ? 'selected' : ''}`} onClick={() => toggleFriendSelection(friend.id)}><div className={`checkbox ${selectedFriendsForGroup.includes(friend.id) ? 'checked' : ''}`}>{selectedFriendsForGroup.includes(friend.id) && <Check size={14} color="white"/>}</div><span>{friend.name}</span></div>)}</div>
                      <button onClick={handleCreateGroup} className="btn-primary" style={{marginTop: '20px'}}>Create Group</button><button onClick={() => setView('groups')} className="btn-cancel">Cancel</button>
                    </div>
                  )}

                  {view === 'history' && (
                    <div style={{marginTop: '20px'}}>
                      <h2 className="title" style={{marginBottom: '20px'}}>History</h2>
                      <div className="tab-container" style={{marginBottom:'20px'}}>
                         <button className={`tab-btn ${historyFilter === 'all' ? 'active' : ''}`} onClick={() => setHistoryFilter('all')}>All</button>
                         <button className={`tab-btn ${historyFilter === 'expenses' ? 'active' : ''}`} onClick={() => setHistoryFilter('expenses')}>Expenses</button>
                         <button className={`tab-btn ${historyFilter === 'settlements' ? 'active' : ''}`} onClick={() => setHistoryFilter('settlements')}>Settlements</button>
                      </div>
                      {Object.keys(getFilteredHistory()).map(month => <div key={month}><div className="month-header">{month}</div>{getFilteredHistory()[month].map(exp => renderTransactionItem(exp))}</div>)}
                    </div>
                  )}
                </>
              )}
            </main>

            {!viewDetails && (
              <nav className="bottom-nav">
                <button onClick={() => setView('dashboard')} className={`nav-item ${view==='dashboard'?'active':''}`}><Home size={24}/><span className="nav-text">Home</span></button>
                <button onClick={() => setView('groups')} className={`nav-item ${view==='groups'?'active':''}`}><Users size={24}/><span className="nav-text">Groups</span></button>
                <button onClick={() => setView('add')} className="fab-btn"><Plus size={28}/></button>
                <button onClick={() => setView('history')} className={`nav-item ${view==='history'?'active':''}`}><History size={24}/><span className="nav-text">History</span></button>
                
                {isAdmin ? (
                  <button onClick={() => setView('admin_panel')} className={`nav-item ${view==='admin_panel'?'active':''}`}><ShieldCheck size={24}/><span className="nav-text">Admin</span></button>
                ) : (
                  <button onClick={() => setView('friends')} className={`nav-item ${view==='friends'?'active':''}`}><User size={24}/><span className="nav-text">Friends</span></button>
                )}
              </nav>
            )}

            {settleUser && (
              <div className="modal-overlay" onClick={() => setSettleUser(null)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                   <h2 className="title" style={{textAlign:'center', marginBottom:'10px'}}>{settleUser.type === 'receive' ? `Receive from ${settleUser.name}` : `Pay ${settleUser.name}`}</h2>
                   <p className="text-muted" style={{textAlign:'center', marginBottom:'20px'}}>{settleUser.type === 'receive' ? "Enter amount received" : "Enter amount paid"}</p>
                   <label className="text-muted">Amount (LKR)</label>
                   <input type="number" id="settleAmount" defaultValue={settleUser.amount} className="big-input" autoFocus />
                   <button onClick={confirmSettlement} className="btn-primary">{settleUser.type === 'receive' ? "Received" : "Paid"}</button>
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
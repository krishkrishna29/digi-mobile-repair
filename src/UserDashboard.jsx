import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { db } from './firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Page Components
import UserRepairs from './UserRepairs';
import ProfileSettings from './ProfileSettings';
import NewRepairRequest from './NewRepairRequest';
import Invoice from './Invoice';
import ChatSupport from './ChatSupport'; // Import ChatSupport

// Icons
import { 
    BellIcon, 
    UserCircleIcon,
    ChartBarIcon, 
    PlusIcon, 
    WrenchScrewdriverIcon, 
    BriefcaseIcon, 
    ClockIcon, 
    CheckCircleIcon,
    Cog8ToothIcon,
    ArrowRightOnRectangleIcon,
    ChatBubbleLeftRightIcon // Import the chat icon
} from '@heroicons/react/24/outline';

const StatCard = ({ icon, title, value, bgColor }) => (
    <div className={`bg-slate-800 p-6 rounded-xl flex items-center space-x-4 shadow-lg`}>
        <div className={`p-3 rounded-full ${bgColor}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const DashboardHome = ({ repairs }) => {
    const totalRepairs = repairs.length;
    const pendingRepairs = repairs.filter(r => r.status !== 'Completed' && r.status !== 'Cancelled').length;
    const completedRepairs = repairs.filter(r => r.status === 'Completed').length;
    
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    icon={<BriefcaseIcon className="h-6 w-6 text-white" />} 
                    title="Total Repairs" 
                    value={totalRepairs} 
                    bgColor="bg-blue-500"
                />
                <StatCard 
                    icon={<ClockIcon className="h-6 w-6 text-white" />} 
                    title="Pending Repairs" 
                    value={pendingRepairs} 
                    bgColor="bg-yellow-500"
                />
                <StatCard 
                    icon={<CheckCircleIcon className="h-6 w-6 text-white" />} 
                    title="Completed Repairs" 
                    value={completedRepairs} 
                    bgColor="bg-green-500"
                />
            </div>
            <UserRepairs repairs={repairs} />
        </div>
    );
};

const UserDashboard = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [repairs, setRepairs] = useState([]);
    const [activeView, setActiveView] = useState('Dashboard');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const [selectedRepair, setSelectedRepair] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);

    useEffect(() => {
        if (!currentUser) return;
        const repairsQuery = query(collection(db, 'repairs'), where('userId', '==', currentUser.uid));
        const unsubscribe = onSnapshot(repairsQuery, (snapshot) => {
            const userRepairs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRepairs(userRepairs);
        });
        return () => unsubscribe();
    }, [currentUser]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = () => {
        logout().then(() => navigate('/login'));
    };

    const handlePayment = async (repairId, paymentMethod) => {
        const repairRef = doc(db, "repairs", repairId);
        await updateDoc(repairRef, {
            paymentStatus: "Paid",
            paymentMethod: paymentMethod,
        });
        setShowPaymentModal(false);
        setSelectedRepair(repairs.find(r => r.id === repairId));
        setShowInvoice(true);
    };

    const downloadInvoice = () => {
        const input = document.getElementById('invoice');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'PNG', 0, 0);
                pdf.save("invoice.pdf");
            });
    };

    const renderContent = () => {
        if (showInvoice) {
            return <Invoice repair={selectedRepair} onDownload={downloadInvoice} onBack={() => setShowInvoice(false)} />;
        }
        switch (activeView) {
            case 'Dashboard':
                return <DashboardHome repairs={repairs} />;
            case 'NewRequest':
                return <NewRepairRequest />;
            case 'MyRepairs':
                return <UserRepairs repairs={repairs} onPayNow={(repair) => { setSelectedRepair(repair); setShowPaymentModal(true); }} />;
            case 'ChatSupport':
                return <ChatSupport />;
            case 'ProfileSettings':
                return <ProfileSettings />;
            default:
                return <div>Select a view</div>;
        }
    };

    const NavLink = ({ icon, text, viewName }) => (
        <button 
            onClick={() => setActiveView(viewName)}
            className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${activeView === viewName ? 'bg-slate-900 text-white' : 'text-gray-400 hover:bg-slate-700 hover:text-white'}`}>
            {icon}
            <span className="font-medium ml-3">{text}</span>
        </button>
    );

    return (
        <div className="flex h-screen bg-slate-900 text-white font-sans">
            <aside className="w-64 bg-slate-800 flex flex-col">
                <div className="px-6 py-5 border-b border-slate-700">
                    <h2 className="text-xl font-bold">My Dashboard</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink icon={<ChartBarIcon className="h-6 w-6" />} text="Dashboard" viewName="Dashboard" />
                    <NavLink icon={<PlusIcon className="h-6 w-6" />} text="New Repair Request" viewName="NewRequest" />
                    <NavLink icon={<WrenchScrewdriverIcon className="h-6 w-6" />} text="My Repairs" viewName="MyRepairs" />
                    <NavLink icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />} text="Chat Support" viewName="ChatSupport" />
                </nav>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
                    <h1 className="text-xl font-semibold text-gray-200">
                      {activeView.replace(/([A-Z])/g, ' $1').trim()} 
                    </h1>
                    <div className="flex items-center space-x-4">
                        <BellIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
                        <div className="relative">
                            <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2">
                                <UserCircleIcon className="h-8 w-8 text-gray-400 cursor-pointer" />
                                <span className="hidden sm:inline font-medium text-gray-300">{currentUser?.displayName || 'User'}</span>
                            </button>
                            {isProfileMenuOpen && (
                                <div ref={profileMenuRef} className="absolute right-0 mt-2 w-56 bg-slate-700 rounded-lg shadow-xl py-2 z-50">
                                    <button 
                                        onClick={() => {setActiveView('ProfileSettings'); setIsProfileMenuOpen(false);}} 
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-600">
                                        <Cog8ToothIcon className="h-5 w-5 mr-3" />
                                        Profile Settings
                                    </button>
                                    <button 
                                        onClick={handleSignOut} 
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-600">
                                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    {renderContent()}
                </main>
            </div>
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-slate-800 p-8 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Choose Payment Option</h2>
                        <div className="flex space-x-4">
                            <button onClick={() => handlePayment(selectedRepair.id, 'Online')} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg">Pay Online</button>
                            <button onClick={() => handlePayment(selectedRepair.id, 'At Shop')} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg">Pay at Shop</button>
                            <button onClick={() => handlePayment(selectedRepair.id, 'On Delivery')} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg">Pay on Delivery</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard; 

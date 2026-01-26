
import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { db } from "../firebase";
import PartnerModal from "../components/PartnerModal";
import ConfirmationModal from "../ConfirmationModal";

const AdminDeliveryPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [partnerToDelete, setPartnerToDelete] = useState(null);
  const [error, setError] = useState(null); // Add a state for errors

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const q = query(collection(db, "users"), where("role", "==", "delivery"));
        const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
          const partnersData = [];
          querySnapshot.forEach((doc) => {
            partnersData.push({ id: doc.id, ...doc.data() });
          });
          setPartners(partnersData);
          setLoading(false);
        }, (err) => {
          console.error("Firestore Snapshot Error:", err);
          setError("Failed to load delivery partners.");
          setLoading(false);
        });
        return () => unsubscribeFirestore(); // Cleanup Firestore subscription
      } else {
        // User is signed out
        setLoading(false);
        setError("Please log in to view delivery partners.");
        console.log("User is not authenticated.");
      }
    });

    return () => unsubscribeAuth(); // Cleanup auth subscription
  }, []);

  const handleSavePartner = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    const formData = new FormData(event.target);
    const fullName = formData.get("fullName");
    const phone = formData.get("phone");

    if (editingPartner) {
      const partnerRef = doc(db, "users", editingPartner.id);
      await updateDoc(partnerRef, {
        fullName: fullName,
        mobileNumber: phone,
      });
      setEditingPartner(null);
    } else {
      const email = formData.get("email");
      const password = formData.get("password");
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          fullName: fullName,
          email: email,
          mobileNumber: phone,
          role: "delivery",
          enabled: true,
          createdAt: new Date(),
        });
      } catch (error) {
        console.error("Error creating new partner:", error);
      }
    }
    setIsModalOpen(false);
  };

  const handleToggleEnabled = async (partner) => {
    const partnerRef = doc(db, "users", partner.id);
    await updateDoc(partnerRef, {
      enabled: !partner.enabled
    });
  };
  
  const openModalForEdit = (partner) => {
    setEditingPartner(partner);
    setIsModalOpen(true);
  };

  const openModalForCreate = () => {
    setEditingPartner(null);
    setIsModalOpen(true);
  };

  const openConfirmModal = (partner) => {
    setPartnerToDelete(partner);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (partnerToDelete) {
      await deleteDoc(doc(db, "users", partnerToDelete.id));
      setPartnerToDelete(null);
    }
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Delivery Partners</h1>
          <button 
            onClick={openModalForCreate}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
          >
            + Add New Partner
          </button>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          {loading && <p>Loading partners...</p>}
          {error && <p className="text-red-500">{error}</p>} 
          {!loading && !error && (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 font-semibold uppercase text-sm border-b border-slate-700">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <tr key={partner.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="py-4 px-4 font-medium text-white">{partner.fullName}</td>
                    <td className="py-4 px-4 text-gray-300">{partner.email}</td>
                    <td className="py-4 px-4 text-gray-300">{partner.mobileNumber}</td>
                    <td className="py-4 px-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={!!partner.enabled} onChange={() => handleToggleEnabled(partner)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-300">{partner.enabled ? 'Enabled' : 'Disabled'}</span>
                      </label>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button onClick={() => openModalForEdit(partner)} className="text-blue-400 hover:text-blue-300 mr-2">Edit</button>
                      <button onClick={() => openConfirmModal(partner)} className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <PartnerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSavePartner} 
        editingPartner={editingPartner}
      />
      <ConfirmationModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Partner"
        message="Are you sure you want to delete this partner? This action cannot be undone."
      />
    </div>
  );
};

export default AdminDeliveryPartners;

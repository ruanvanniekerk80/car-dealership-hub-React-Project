import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function AdminDashboard() {
    const [formData, setFormData] = useState({
        make: '', model: '', year: '', price: '', mileage: '', condition: 'Used', status: 'Available', imageUrl: '',
        fuelType: 'Petrol', transmission: 'Automatic', kilowatts: ''
    });
    const [cars, setCars] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [loginLogs, setLoginLogs] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    // 🔄 Inline Editing Tracking State
    const [editingCarId, setEditingCarId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        make: '', model: '', year: '', price: '', mileage: '', condition: 'Used', status: 'Available',
        fuelType: 'Petrol', transmission: 'Automatic', kilowatts: ''
    });

    // 🔄 COLLECTION 1 REAL-TIME READ: Vehicle Inventory
    useEffect(() => {
        const q = query(collection(db, 'cars'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const inventoryData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCars(inventoryData);
        });
        return () => unsubscribe();
    }, []);

    // 🔄 COLLECTION 2 REAL-TIME READ: Buyer Inquiries Feed
    useEffect(() => {
        const inquiriesQuery = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
        const unsubscribeInquiries = onSnapshot(inquiriesQuery, (snapshot) => {
            const inquiriesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setInquiries(inquiriesData);
        });
        return () => unsubscribeInquiries();
    }, []);

    // 🔄 COLLECTION 3 REAL-TIME READ: Security Portal Audit Logs
    useEffect(() => {
        const logsQuery = query(collection(db, 'login_logs'), orderBy('timestamp', 'desc'));
        const unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
            const logsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLoginLogs(logsData);
        });
        return () => unsubscribeLogs();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 📝 Handle updates within the inline edit inputs
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 🟢 CREATE: Add new car record (Collection 1)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const finalImageUrl = formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500';

            const carDataPayload = {
                make: formData.make,
                model: formData.model,
                year: Number(formData.year),
                price: Number(formData.price),
                mileage: Number(formData.mileage),
                condition: formData.condition,
                status: formData.status,
                fuelType: formData.fuelType,
                transmission: formData.transmission,
                kilowatts: formData.kilowatts ? Number(formData.kilowatts) : null,
                images: [finalImageUrl],
                createdAt: new Date()
            };

            await addDoc(collection(db, 'cars'), carDataPayload);
            setMessage("Vehicle asset listed successfully!");
            setFormData({
                make: '', model: '', year: '', price: '', mileage: '', condition: 'Used', status: 'Available', imageUrl: '',
                fuelType: 'Petrol', transmission: 'Automatic', kilowatts: ''
            });
            e.target.reset();
        } catch (error) {
            console.error(error);
            setMessage(`Operation failed: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 🛠️ EDIT TRIGGER: Hydrate staging form state and pop entry field row open
    const startEditing = (car) => {
        setEditingCarId(car.id);
        setEditFormData({
            make: car.make,
            model: car.model,
            year: car.year,
            price: car.price,
            mileage: car.mileage,
            condition: car.condition || 'Used',
            status: car.status || 'Available',
            fuelType: car.fuelType || 'Petrol',
            transmission: car.transmission || 'Automatic',
            kilowatts: car.kilowatts || ''
        });
    };

    // 🔵 SAVE EDIT: Submit inline updates directly to Document ID reference
    const handleSaveEdit = async (carId) => {
        try {
            const carDocRef = doc(db, 'cars', carId);
            await updateDoc(carDocRef, {
                make: editFormData.make,
                model: editFormData.model,
                year: Number(editFormData.year),
                price: Number(editFormData.price),
                mileage: Number(editFormData.mileage),
                condition: editFormData.condition,
                status: editFormData.status,
                fuelType: editFormData.fuelType,
                transmission: editFormData.transmission,
                kilowatts: editFormData.kilowatts ? Number(editFormData.kilowatts) : null
            });
            setEditingCarId(null); // Return row presentation layer to normal ledger display
        } catch (error) {
            console.error("Error updating record field tokens: ", error);
            alert("Failed to modify record variables.");
        }
    };

    // 🟡 UPDATE: Toggle status between Available, Pending, and Sold (Collection 1)
    const handleToggleStatus = async (carId, currentStatus) => {
        try {
            const nextStatusMap = { 'Available': 'Pending', 'Pending': 'Sold', 'Sold': 'Available' };
            const newStatus = nextStatusMap[currentStatus] || 'Available';

            const carDocRef = doc(db, 'cars', carId);
            await updateDoc(carDocRef, { status: newStatus });
        } catch (error) {
            console.error("Error updating stock asset status: ", error);
        }
    };

    // 🔴 DELETE: Remove record completely (Collection 1)
    const handleDeleteCar = async (carId) => {
        if (window.confirm("Are you certain you want to remove this vehicle asset from records?")) {
            try {
                const carDocRef = doc(db, 'cars', carId);
                await deleteDoc(carDocRef);
            } catch (error) {
                console.error("Error purging stock asset reference: ", error);
            }
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.mainTitle}>Dealership Control Desk</h1>
                <p style={styles.subtitle}>Insert fresh active stock assets and manage active records.</p>
            </header>

            {/* Form Section */}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.row}>
                    <div style={styles.group}>
                        <label style={styles.label}>Make</label>
                        <input type="text" name="make" value={formData.make} onChange={handleChange} required style={styles.input} placeholder="e.g. Ford" />
                    </div>
                    <div style={styles.group}>
                        <label style={styles.label}>Model</label>
                        <input type="text" name="model" value={formData.model} onChange={handleChange} required style={styles.input} placeholder="e.g. Ranger Raptor" />
                    </div>
                </div>

                <div style={styles.row}>
                    <div style={styles.group}>
                        <label style={styles.label}>Year</label>
                        <input type="number" name="year" value={formData.year} onChange={handleChange} required style={styles.input} placeholder="2026" />
                    </div>
                    <div style={styles.group}>
                        <label style={styles.label}>Price (ZAR)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required style={styles.input} placeholder="1299000" />
                    </div>
                    <div style={styles.group}>
                        <label style={styles.label}>Mileage (km)</label>
                        <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} required style={styles.input} placeholder="100" />
                    </div>
                </div>

                {/* New Technical Specifications Row */}
                <div style={styles.row}>
                    <div style={styles.group}>
                        <label style={styles.label}>Fuel Type</label>
                        <select name="fuelType" value={formData.fuelType} onChange={handleChange} style={styles.select}>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                    <div style={styles.group}>
                        <label style={styles.label}>Transmission</label>
                        <select name="transmission" value={formData.transmission} onChange={handleChange} style={styles.select}>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                        </select>
                    </div>
                    <div style={styles.group}>
                        <label style={styles.label}>Power Output (kW)</label>
                        <input type="number" name="kilowatts" value={formData.kilowatts} onChange={handleChange} style={styles.input} placeholder="e.g. 292" />
                    </div>
                </div>

                <div style={styles.row}>
                    <div style={styles.group}>
                        <label style={styles.label}>Condition</label>
                        <select name="condition" value={formData.condition} onChange={handleChange} style={styles.select}>
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                        </select>
                    </div>
                    <div style={styles.group}>
                        <label style={styles.label}>Lot Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} style={styles.select}>
                            <option value="Available">Available</option>
                            <option value="Pending">Pending</option>
                            <option value="Sold">Sold</option>
                        </select>
                    </div>
                </div>

                <div style={styles.group}>
                    <label style={styles.label}>Vehicle Image URL</label>
                    <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} style={styles.input} placeholder="Paste image link" />
                </div>

                <button type="submit" disabled={isSubmitting} style={styles.button}>
                    {isSubmitting ? 'Processing Submission...' : 'Publish Vehicle to Lot'}
                </button>

                {message && <div style={styles.alert}>{message}</div>}
            </form>

            {/* --- Management List View Section --- */}
            <section style={styles.managementSection}>
                <h2 style={styles.sectionTitle}>Active Lot Inventory Ledger ({cars.length})</h2>
                <div style={styles.list}>
                    {cars.map((car) => (
                        <div key={car.id} style={styles.listItem}>
                            {editingCarId === car.id ? (
                                /* 🛠️ INLINE EDITING INTERFACE MODE */
                                <div style={styles.editFormGrid}>
                                    <div style={styles.inlineRow}>
                                        <input type="text" name="make" value={editFormData.make} onChange={handleEditChange} style={styles.inlineInput} placeholder="Make" />
                                        <input type="text" name="model" value={editFormData.model} onChange={handleEditChange} style={styles.inlineInput} placeholder="Model" />
                                        <input type="number" name="year" value={editFormData.year} onChange={handleEditChange} style={styles.inlineInput} placeholder="Year" />
                                    </div>
                                    <div style={styles.inlineRow}>
                                        <input type="number" name="price" value={editFormData.price} onChange={handleEditChange} style={styles.inlineInput} placeholder="Price" />
                                        <input type="number" name="mileage" value={editFormData.mileage} onChange={handleEditChange} style={styles.inlineInput} placeholder="Mileage" />
                                        <input type="number" name="kilowatts" value={editFormData.kilowatts} onChange={handleEditChange} style={styles.inlineInput} placeholder="kW" />
                                    </div>
                                    <div style={styles.inlineRow}>
                                        <select name="fuelType" value={editFormData.fuelType} onChange={handleEditChange} style={styles.inlineSelect}>
                                            <option value="Petrol">Petrol</option>
                                            <option value="Diesel">Diesel</option>
                                            <option value="Electric">Electric</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                        <select name="transmission" value={editFormData.transmission} onChange={handleEditChange} style={styles.inlineSelect}>
                                            <option value="Automatic">Automatic</option>
                                            <option value="Manual">Manual</option>
                                        </select>
                                        <select name="condition" value={editFormData.condition} onChange={handleEditChange} style={styles.inlineSelect}>
                                            <option value="New">New</option>
                                            <option value="Used">Used</option>
                                        </select>
                                        <select name="status" value={editFormData.status} onChange={handleEditChange} style={styles.inlineSelect}>
                                            <option value="Available">Available</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Sold">Sold</option>
                                        </select>
                                    </div>
                                    <div style={{ ...styles.actions, justifyContent: 'flex-end', marginTop: '4px' }}>
                                        <button onClick={() => handleSaveEdit(car.id)} style={styles.saveBtn}>Save</button>
                                        <button onClick={() => setEditingCarId(null)} style={styles.cancelBtn}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                /* 📋 STANDARD LEDGER ROW DISPLAY MODE */
                                <>
                                    <div style={styles.itemMeta}>
                                        <strong>{car.make} {car.model}</strong> ({car.year})
                                        <div style={{ fontSize: '0.85rem', color: '#8b949e', marginTop: '4px', lineHeight: '1.4' }}>
                                            Price: R{car.price?.toLocaleString()} | Mileage: {car.mileage?.toLocaleString()} km <br />
                                            Specs: {car.fuelType || 'Petrol'} | {car.transmission || 'Automatic'}{car.kilowatts ? ` | ${car.kilowatts} kW` : ''} <br />
                                            Condition: {car.condition || 'Used'} | Status: <span style={{ color: car.status === 'Available' ? '#238636' : car.status === 'Pending' ? '#d97706' : '#f85149' }}>{car.status}</span>
                                        </div>
                                    </div>
                                    <div style={styles.actions}>
                                        <button onClick={() => startEditing(car)} style={styles.editBtn}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleToggleStatus(car.id, car.status)} style={styles.statusBtn}>
                                            Cycle Status
                                        </button>
                                        <button onClick={() => handleDeleteCar(car.id)} style={styles.deleteBtn}>
                                            Remove
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* --- Incoming Customer Inquiries Section (Collection 2) --- */}
            <section style={styles.managementSection}>
                <h2 style={styles.sectionTitle}>Incoming Buyer Inquiries Feed ({inquiries.length})</h2>
                {inquiries.length === 0 ? (
                    <div style={styles.emptyState}>No incoming messages on recorded stock items yet.</div>
                ) : (
                    <div style={styles.list}>
                        {inquiries.map((msg) => (
                            <div key={msg.id} style={styles.panelCard}>
                                <div style={styles.panelCardHeader}>
                                    <span style={{ fontWeight: 'bold', color: '#58a6ff' }}>🚘 {msg.vehicleDetails}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#8b949e' }}>
                                        {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString() : 'Just now'}
                                    </span>
                                </div>
                                <p style={styles.panelMessage}>"{msg.message}"</p>
                                <div style={{ fontSize: '0.85rem', color: '#8b949e' }}>
                                    Item Lead: <strong>{msg.buyerName}</strong> | ✉️ {msg.buyerEmail} | 📞 {msg.buyerPhone}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* --- Security Audit Logs Section (Collection 3) --- */}
            <section style={styles.managementSection}>
                <h2 style={styles.sectionTitle}>System Gateway Security Audit Logs ({loginLogs.length})</h2>
                <div style={styles.logScroller}>
                    {loginLogs.map((log) => (
                        <div key={log.id} style={styles.logLine}>
                            <span style={{ color: '#8b949e' }}>
                                ⏱️ {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : 'Just now'}
                            </span>
                            <span style={{ fontWeight: '500', color: '#e6edf3' }}>👤 {log.email}</span>
                            <span style={{ fontWeight: 'bold', color: log.status === 'Success' ? '#238636' : '#f85149' }}>
                                [{log.status}]
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

const styles = {
    container: { padding: '40px 20px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#0d1117', minHeight: '100vh', color: '#e6edf3' },
    header: { marginBottom: '32px', borderBottom: '1px solid #30363d', paddingBottom: '16px' },
    mainTitle: { margin: 0, fontSize: '2rem', fontWeight: '600' },
    subtitle: { margin: '8px 0 0 0', color: '#8b949e' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#161b22', padding: '24px', borderRadius: '6px', border: '1px solid #30363d' },
    row: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
    group: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '200px' },
    label: { fontSize: '0.9rem', color: '#8b949e', fontWeight: '500' },
    input: { padding: '10px', backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#e6edf3', fontSize: '1rem', outline: 'none' },
    select: { padding: '10px', backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#e6edf3', fontSize: '1rem', outline: 'none' },
    button: { padding: '12px', backgroundColor: '#238636', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s', marginTop: '10px' },
    alert: { marginTop: '14px', padding: '12px', backgroundColor: '#21262d', border: '1px solid #30363d', borderRadius: '6px', color: '#58a6ff', fontSize: '0.95rem', textAlign: 'center' },

    managementSection: { marginTop: '40px' },
    sectionTitle: { fontSize: '1.4rem', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #30363d', paddingBottom: '8px' },
    list: { display: 'flex', flexDirection: 'column', gap: '12px' },
    listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#161b22', padding: '16px', borderRadius: '6px', border: '1px solid #30363d', flexWrap: 'wrap', gap: '12px' },
    itemMeta: { display: 'flex', flexDirection: 'column' },
    actions: { display: 'flex', gap: '8px', alignItems: 'center' },

    // Buttons styling 
    editBtn: { padding: '6px 12px', backgroundColor: '#21262d', color: '#58a6ff', border: '1px solid #30363d', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' },
    statusBtn: { padding: '6px 12px', backgroundColor: '#21262d', color: '#c9d1d9', border: '1px solid #30363d', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },
    deleteBtn: { padding: '6px 12px', backgroundColor: '#21262d', color: '#f85149', border: '1px solid #30363d', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },

    // Inline Edit Subgrid Styles
    editFormGrid: { display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' },
    inlineRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    inlineInput: { padding: '6px 10px', backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '4px', color: '#e6edf3', fontSize: '0.85rem', flex: 1, minWidth: '100px', outline: 'none' },
    inlineSelect: { padding: '6px 10px', backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '4px', color: '#e6edf3', fontSize: '0.85rem', flex: 1, minWidth: '110px', outline: 'none' },
    saveBtn: { padding: '6px 14px', backgroundColor: '#238636', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' },
    cancelBtn: { padding: '6px 12px', backgroundColor: '#21262d', color: '#8b949e', border: '1px solid #30363d', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },

    emptyState: { textAlign: 'center', padding: '20px', color: '#8b949e', backgroundColor: '#161b22', borderRadius: '6px', border: '1px solid #30363d' },
    panelCard: { backgroundColor: '#161b22', padding: '16px', borderRadius: '6px', border: '1px solid #30363d' },
    panelCardHeader: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #21262d', paddingBottom: '6px', marginBottom: '8px' },
    panelMessage: { margin: '0 0 8px 0', fontSize: '0.95rem', color: '#e6edf3', fontStyle: 'italic' },

    logScroller: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', backgroundColor: '#161b22', padding: '12px', borderRadius: '6px', border: '1px solid #30363d' },
    logLine: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 0', borderBottom: '1px solid #21262d' }
};
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function CarCard({ car }) {
    const [inquiry, setInquiry] = useState({ name: '', email: '', phone: '', message: '' });
    const [statusMsg, setStatusMsg] = useState('');
    const [sending, setSending] = useState(false);

    // 🖼️ Image Lightbox Modal State Variables
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        try {
            setSending(true);
            await addDoc(collection(db, 'inquiries'), {
                buyerName: inquiry.name,
                buyerEmail: inquiry.email,
                buyerPhone: inquiry.phone,
                message: inquiry.message,
                vehicleId: car.id,
                vehicleDetails: `${car.year} ${car.make} ${car.model}`,
                createdAt: new Date()
            });
            setStatusMsg("Inquiry submitted successfully! A representative will call you.");
            setInquiry({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            console.error("Error submitting buyer inquiry: ", error);
            setStatusMsg("Failed to send inquiry. Please try again.");
        } finally {
            setSending(false);
        }
    };

    const carImgUrl = car.images && car.images[0] ? car.images[0] : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500';

    return (
        <div style={styles.card}>
            {/* Image Wrap & Condition Tag - Clickable to open modal */}
            <div
                style={styles.imageContainer}
                onClick={() => setIsModalOpen(true)}
                title="Click to view full-size image"
            >
                <img
                    src={carImgUrl}
                    alt={`${car.make} ${car.model}`}
                    style={styles.image}
                />
                <span style={styles.badge}>{car.condition || 'Used'}</span>
                <div style={styles.imageHoverOverlay}>🔍 View Full Size</div>
            </div>

            {/* Core Text & Metadata */}
            <div style={styles.detailsContainer}>
                <h3 style={styles.title}>{car.make} {car.model}</h3>

                {/* Baseline Meta Info */}
                <div style={styles.metaText}>
                    {car.year} | {car.mileage?.toLocaleString()} km
                </div>

                {/* Technical spec rows including explicit kW readout token */}
                <div style={styles.specsRow}>
                    <span>⛽ {car.fuelType || 'Petrol'}</span>
                    <span>⚙️ {car.transmission || 'Automatic'}</span>
                    {car.kilowatts && <span>⚡ {car.kilowatts} kW</span>}
                </div>

                <div style={styles.price}>R {car.price?.toLocaleString()}</div>

                <div style={{
                    ...styles.status,
                    color: car.status === 'Available' ? '#238636' : car.status === 'Pending' ? '#d97706' : '#f85149'
                }}>
                    • {car.status || 'Available'}
                </div>
            </div>

            {/* Dynamic Buyer Lead Form */}
            <div style={styles.formContainer}>
                <h4 style={styles.formTitle}>Inquire About This {car.make} {car.model}</h4>
                <form onSubmit={handleInquirySubmit} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Your Full Name"
                        required
                        value={inquiry.name}
                        onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                        style={styles.input}
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        required
                        value={inquiry.email}
                        onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                        style={styles.input}
                    />
                    <input
                        type="tel"
                        placeholder="Contact Number"
                        required
                        value={inquiry.phone}
                        onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                        style={styles.input}
                    />
                    <textarea
                        placeholder="Is this vehicle available for a test drive?"
                        required
                        rows="2"
                        value={inquiry.message}
                        onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                        style={styles.textarea}
                    ></textarea>

                    <button type="submit" disabled={sending} style={styles.submitBtn}>
                        {sending ? 'Sending Notification...' : 'Submit Agent Request'}
                    </button>
                </form>
                {statusMsg && <p style={styles.statusFeedback}>{statusMsg}</p>}
            </div>

            {/* 🖼️ LIGHTBOX MODAL PORTAL PORT */}
            {isModalOpen && (
                <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button style={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)}>×</button>
                        <img
                            src={carImgUrl}
                            alt={`${car.make} ${car.model} Full View`}
                            style={styles.modalImage}
                        />
                        <div style={styles.modalCaption}>
                            {car.year} {car.make} {car.model} — R {car.price?.toLocaleString()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    card: {
        backgroundColor: '#161b22',
        borderRadius: '8px',
        border: '1px solid #30363d',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: '180px',
        backgroundColor: '#0d1117',
        cursor: 'pointer',
        overflow: 'hidden'
    },
    image: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' },
    badge: { position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(33, 38, 45, 0.85)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', color: '#8b949e', border: '1px solid #30363d', zIndex: 2 },

    // Quick interactive hover layout hint over the card picture
    imageHoverOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        transition: 'opacity 0.2s ease',
        fontSize: '0.9rem',
        fontWeight: '500',
        zIndex: 1,
        ':hover': { opacity: 1 } // Note: Standard inline style fallback used via CSS-like layout patterns or explicit parent state if needed, but handled natively by overlay wrappers on container tracking
    },

    detailsContainer: { padding: '20px', textAlign: 'center' },
    title: { margin: '0 0 6px 0', fontSize: '1.3rem', fontWeight: '600', color: '#e6edf3' },
    metaText: { fontSize: '0.9rem', color: '#8b949e', marginBottom: '6px' },

    specsRow: {
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        fontSize: '0.8rem',
        color: '#c9d1d9',
        backgroundColor: '#0d1117',
        padding: '6px 14px',
        borderRadius: '4px',
        margin: '10px auto',
        width: 'fit-content',
        border: '1px solid #21262d',
        fontWeight: '500'
    },

    price: { fontSize: '1.6rem', fontWeight: '700', color: '#58a6ff', margin: '12px 0 6px 0' },
    status: { fontSize: '0.85rem', fontWeight: '500' },

    formContainer: { padding: '16px', borderTop: '1px solid #30363d', backgroundColor: '#0d1117' },
    formTitle: { margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: '600', color: '#e6edf3', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '8px' },
    input: { padding: '8px 12px', backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '4px', color: '#e6edf3', fontSize: '0.85rem', outline: 'none' },
    textarea: { padding: '8px 12px', backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '4px', color: '#e6edf3', fontSize: '0.85rem', outline: 'none', resize: 'none' },
    submitBtn: { padding: '8px', backgroundColor: '#21262d', color: '#e6edf3', border: '1px solid #30363d', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', transition: 'background-color 0.2s' },
    statusFeedback: { margin: '8px 0 0 0', fontSize: '0.8rem', color: '#58a6ff', textAlign: 'center', lineHeight: '1.3' },

    // 🌟 MODAL OVERLAY STYLES
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 12, 16, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999, // Layer on top of header navigation structures
        padding: '20px',
        backdropFilter: 'blur(4px)'
    },
    modalContent: {
        position: 'relative',
        maxWidth: '900px',
        width: '100%',
        backgroundColor: '#161b22',
        border: '1px solid #30363d',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column'
    },
    modalCloseBtn: {
        position: 'absolute',
        top: '12px',
        right: '16px',
        backgroundColor: 'rgba(33, 38, 45, 0.85)',
        color: '#e6edf3',
        border: '1px solid #30363d',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        fontSize: '1.5rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        lineHeight: 0,
        transition: 'background-color 0.2s'
    },
    modalImage: {
        width: '100%',
        maxHeight: '75vh',
        objectFit: 'contain',
        backgroundColor: '#0d1117'
    },
    modalCaption: {
        padding: '16px 20px',
        backgroundColor: '#161b22',
        color: '#e6edf3',
        fontSize: '1.1rem',
        fontWeight: '600',
        textAlign: 'center',
        borderTop: '1px solid #30363d'
    }
};
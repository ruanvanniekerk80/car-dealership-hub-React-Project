import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function InquiryForm({ carId, carName }) {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            setStatusMsg('Transmitting interest inquiry...');

            const inquiryPayload = {
                carId: carId,               // The critical relational reference link
                vehicleDetails: carName,    // Cached string helper for quick admin viewing
                buyerName: formData.name,
                buyerEmail: formData.email,
                buyerPhone: formData.phone,
                message: formData.message,
                createdAt: new Date()
            };

            // Write directly to our brand new second collection endpoint
            await addDoc(collection(db, 'inquiries'), inquiryPayload);

            setStatusMsg('Inquiry submitted! The sales deck will reach out shortly.');
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            console.error("Error submitting buyer inquiry: ", error);
            setStatusMsg('Submission error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h4 style={styles.title}>Inquire About This {carName}</h4>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Full Name" required style={styles.input} />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required style={styles.input} />
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Contact Phone Number" required style={styles.input} />
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Write your message here... (e.g., I want to arrange a test drive)" required style={styles.textarea} />
            <button type="submit" disabled={isSubmitting} style={styles.btn}>
                {isSubmitting ? 'Sending...' : 'Submit Contact Dealer Request'}
            </button>
            {statusMsg && <p style={styles.alert}>{statusMsg}</p>}
        </form>
    );
}

const styles = {
    form: { display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#161b22', padding: '16px', borderRadius: '6px', border: '1px solid #30363d', marginTop: '16px' },
    title: { margin: '0 0 6px 0', fontSize: '1rem', color: '#e6edf3' },
    input: { padding: '8px 12px', backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '#0d1117', color: '#e6edf3', borderRadius: '6px', fontSize: '0.9rem', outline: 'none' },
    textarea: { padding: '8px 12px', backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#e6edf3', borderRadius: '6px', fontSize: '0.9rem', minHeight: '60px', resize: 'vertical', outline: 'none', fontFamily: 'inherit' },
    btn: { padding: '10px', backgroundColor: '#1f6feb', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' },
    alert: { margin: '4px 0 0 0', fontSize: '0.85rem', color: '#58a6ff', textAlign: 'center' }
};
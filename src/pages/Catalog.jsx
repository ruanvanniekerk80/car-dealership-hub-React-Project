import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import CarCard from '../components/CarCard';

// 🏁 Destructured { filter } incoming from App.jsx state manager
export default function Catalog({ filter }) {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                setLoading(true);
                // Reference our specific Firestore collection
                const carsCollectionRef = collection(db, 'cars');
                const snapshot = await getDocs(carsCollectionRef);

                // Map data arrays out of the Firestore query snapshot documents
                const inventoryData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setCars(inventoryData);
            } catch (error) {
                console.error("Error fetching vehicle assets: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    if (loading) {
        return <div style={styles.centeredMessage}>Retrieving live inventory assets...</div>;
    }

    // Now evaluates perfectly because 'filter' is accepted in scope above
    const filteredCars = cars.filter(car => {
        if (filter === 'All') return true;
        return car.condition?.toLowerCase() === filter.toLowerCase();
    });

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.mainTitle}>Dealership Lot Inventory</h1>
                <p style={styles.subtitle}>
                    Showing {filter.toLowerCase()} active vehicle listings below.
                </p>
            </header>

            {filteredCars.length === 0 ? (
                <div style={styles.centeredMessage}>No matching stock vehicles are currently on the lot.</div>
            ) : (
                <div style={styles.grid}>
                    {filteredCars.map((car) => (
                        <CarCard key={car.id} car={car} />
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#0d1117',
        minHeight: '100vh',
        color: '#e6edf3'
    },
    header: {
        marginBottom: '32px',
        borderBottom: '1px solid #30363d',
        paddingBottom: '16px'
    },
    mainTitle: {
        margin: 0,
        fontSize: '2rem',
        fontWeight: '600'
    },
    subtitle: {
        margin: '8px 0 0 0',
        color: '#8b949e'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
    },
    centeredMessage: {
        textAlign: 'center',
        padding: '40px',
        color: '#8b949e',
        fontSize: '1.1rem'
    }
};
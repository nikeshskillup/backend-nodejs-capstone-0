import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';

import './UserListingsPage.css';

function UserListingsPage({ username, sampleProducts }) {
    const navigate = useNavigate();

    const userProducts = sampleProducts.filter(product => product.posted_by === "26872");

    const handleViewDetails = (productId) => {
        navigate(`${urlConfig.backendUrl}/app/product/${productId}`);
    };

    return (
        <div className="container mt-5">
            <h2>{username}'s Listings</h2>
            {userProducts.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Condition</th>
                            <th>Date Added</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userProducts.map(product => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>{product.condition}</td>
                                <td>{new Date(product.date_added * 1000).toLocaleDateString()}</td>
                                <td>
                                    <i className="fas fa-eye action-icon" onClick={() => handleViewDetails(product.id)}></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No listings found.</p>
            )}
        </div>
    );
}

export default UserListingsPage;

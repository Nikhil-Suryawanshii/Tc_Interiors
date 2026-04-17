import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const OrderSuccess = () => {
  const { id } = useParams();
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'1.5rem',textAlign:'center',padding:'2rem',paddingTop:'100px'}}>
      <FiCheckCircle size={64} color="var(--gold)" />
      <h1 style={{fontFamily:'var(--font-display)',fontSize:'2.5rem',color:'var(--charcoal)'}}>Order Placed!</h1>
      <p style={{color:'var(--text-light)',maxWidth:'400px'}}>Thank you for your order. We have received it and will confirm shortly. Your order reference is <strong style={{color:'var(--charcoal)'}}>#{id?.slice(-8).toUpperCase()}</strong>.</p>
      <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',justifyContent:'center'}}>
        <Link to="/profile" className="btn-primary">Track Order <FiArrowRight/></Link>
        <Link to="/shop" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
};
export default OrderSuccess;

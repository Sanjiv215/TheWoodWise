import "./Orders.css";

function Orders({ orders }) {
  return (
    <main className="page">
      <div className="page-title">
        <p className="blue-text">History</p>
        <h1>Order History</h1>
      </div>

      {orders.length === 0 ? (
        <div className="empty-box">No orders placed yet.</div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-card" key={`${order.id}-${order.date}-${order.time}`}>
              <h3>{order.product}</h3>
              <p>ID: {order.id}</p>
              <p>{order.date} · {order.time}</p>
              <p>Payment: {order.paymentMode}</p>
              <h3>₹{order.price.toLocaleString("en-IN")}</h3>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Orders;

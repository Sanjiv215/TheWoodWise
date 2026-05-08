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
            <div className="order-card" key={order.id}>
              <h3>Order #{order.id}</h3>
              <p>{order.date}</p>
              <p>{order.items.length} item(s)</p>
              <h3>₹{order.total.toLocaleString("en-IN")}</h3>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Orders;

export const processPayment = async (cartId, method) => {
  try {
    const response = await fetch("/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId, method }),
    });
    if (!response.ok) throw new Error("Payment failed");
    return await response.json();
  } catch (error) {
    console.error("Payment error:", error);
    throw error;
  }
};

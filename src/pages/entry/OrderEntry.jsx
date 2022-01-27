import { useOrderDetails } from "../../contexts/OrderDetails";
import Options from "./Options";

const OrderEntry = () => {
  const [orderDetails] = useOrderDetails;

  return (
    <div>
      <h1>Design your Sundae!</h1>
      <Options optionType="scoops" />
      <Options optionType="toppings" />
      <h2>Grand Total: {orderDetails.total.grandTotal}</h2>
    </div>
  );
};

export default OrderEntry;

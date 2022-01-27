import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import OrderEntry from "../OrderEntry";

test("Update scoop subtotal when scoops change", async () => {
  render(<Options optionType="scoops" />);

  //Make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText("Scoops total; $", { exact: false }); //Pongo exact false ya que no es exactamente el texto, si no que contiene mas informacion, si no podria haber usado una expresion regular, con esto encontrara el elemento por mas que no sea el string entero
  expect(scoopsSubtotal).toHaveTextContent("0.00"); //Si en alguna parte contiene este texto pasara el test, de lo contrario lo fallara

  //Update Vanilla Scoops to 1 and check the subtotal
  const vanillaScoop = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  userEvent.clear(vanillaScoop); //Con esto elimino cualquier accion que haya realizado el usuario
  userEvent.type(vanillaScoop, "1");
  expect(scoopsSubtotal).toHaveTextContent("2.00");
  //Update Chocolate Scoops to 2 and check the subtotal
  const chocolateScoop = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  userEvent.clear(chocolateScoop);
  userEvent.type(chocolateScoop, "2");
  expect(scoopsSubtotal).toHaveTextContent("6.00");
});

test("Update toppings subtotal when toppings change ", async () => {
  //Render parent component
  render(<Options optionType="toppings" />);

  //Make sure total strats out at $0.00
  const toppingsTotal = screen.getByText("Toppings total: $", { exact: false });
  expect(toppingsTotal).toHaveTextContent("0.00");

  //Add cherries and check subtotal
  const cherriesCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });

  userEvent.click(cherriesCheckbox);
  expect(toppingsTotal).toHaveTextContent("1.50");

  const hotFudgeCheckbox = screen.getByRole("checkbox", { name: "Hot fudge" });
  userEvent.click(hotFudgeCheckbox);
  expect(toppingsTotal).toHaveTextContent("3.00");

  //Remove hot fudge and check subtotal
  userEvent.click(hotFudgeCheckbox);
  expect(toppingsTotal).toHaveTextContent("1.50");
});

describe("grand total", () => {
  test("Gran total starts at $0.00", () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });
    expect(grandTotal).toHaveTextContent("0.00");
  });

  test("Gran total updates properly if scoop is added first", async () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });

    //Update vanilla scoops to 2 and check grand total
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "2");
    expect(grandTotal).toHaveTextContent("4.00");

    //Add Cherries and check grand total
    const cherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    userEvent.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent("5.50");
  });

  test("Gran total updates properly if topping is added first", async () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });

    //Add Cherries and check grand total
    const cherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    userEvent.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent("1.50");

    //Update vanilla scoops to 2 and check grand total
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "2");
    expect(grandTotal).toHaveTextContent("5.50");
  });

  test("Gran total updates properly if item is removed", async () => {
    //Add Cherries
    const cherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    userEvent.click(cherriesCheckbox);
    //Grand total is going to be $1.50

    //Update vanilla scoops to 2 (grand total should be $5.50))
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "2");

    //Remove 1 scoop of vanilla and check grand total
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "1");

    //Check grand total
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });
    expect(grandTotal).toHaveTextContent("3.50");

    //Remove cherries and check grand total
    userEvent.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent("2.00");
  });
});

import { render, screen } from "../../../test-utils/testing-library-utils";
import Options from "../Options";

test("Displays image for each scoop option from server", async () => {
  //Le paso el prop que tiene y lo simulo
  render(<Options optionType="scoops" />);

  //Find images
  const scoopImages = await screen.findAllByRole("img", { name: /scoop$/i }); //La imagen va a terminar en "scoop"
  expect(scoopImages).toHaveLength(2);

  //Confirm all text of images
  const altText = scoopImages.map((element) => element.alt);
  expect(altText).toEqual(["Chocolate scoop", "Vanilla scoop"]);
});

test("Displays image for each toppings option from server", async () => {
  //Le paso el prop que tiene (Mock Service Worker will return three toppings from server)
  render(<Options optionType="toppings" />);

  //Find images, expect 3 based on what msw returns
  const toppingImages = await screen.findAllByRole("img", {
    name: /topping$/i,
  }); //La imagen va a terminar en "scoop"
  expect(toppingImages).toHaveLength(3);

  //Confirm all text of images
  const altText = toppingImages.map((element) => element.alt);
  expect(altText).toEqual([
    "Cherries topping",
    "M&Ms topping",
    "Hot fudge topping",
  ]);
});

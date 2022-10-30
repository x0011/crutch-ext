import { logo, menu, ticketList } from "../views/main";

export const changeLogo = () => {
  const logoImg = logo.querySelector('img');
  // logoImg.setAttribute("src", "https://www.whmcs.com/assets/images/logos/whmcs-logo-sm-inverse.png");
  logoImg.src = "https://www.whmcs.com/assets/images/logos/whmcs-logo-sm-inverse.png";
}
import Footer from "../../components/Footer/Footer";
import FindProsessional from "./components/FindProsessional";
import Header from "./components/Header";
import HowItWork from "./components/HowItWork";
import RequestForm from "./components/RequestForm";
import Testimonials from "./components/Testimonials";

const HomeCustomer = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <FindProsessional />
      <HowItWork />
      <RequestForm />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default HomeCustomer;

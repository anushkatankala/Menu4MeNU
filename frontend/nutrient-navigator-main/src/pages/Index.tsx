import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import NutrientSelector from "@/components/NutrientSelector";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";


const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

type IndexProps = {
  isDark: boolean;
  toggleDarkMode: () => void;
};

const Index = ({ isDark, toggleDarkMode }: IndexProps) => {


  return (
    <main className="min-h-screen">
      <div id="tts-content">
        <motion.div
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />
        </motion.div>

        <motion.div
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <HeroSection />
        </motion.div>

        <motion.div
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <HowItWorks />
        </motion.div>

        <motion.div
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <FeaturesSection />
        </motion.div>

        <motion.div
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <NutrientSelector />
        </motion.div>

        <motion.div
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <CTASection />
        </motion.div>
      </div>

      <Footer />
    </main>
  );
};



export default Index;

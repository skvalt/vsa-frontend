import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <div className="mt-16 pb-24 text-center text-gray-400 text-sm">

      {/* SOCIAL ICONS WITH DOCK ANIMATION */}
      <div className="flex justify-center gap-6 mb-2">
        
        {/* LINKEDIN */}
        <motion.a
          href="https://www.linkedin.com/in/shivamkarn/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-indigo-400 transition"
          whileHover={{ scale: 1.6, y: -6 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaLinkedin size={24} />
        </motion.a>

        {/* GITHUB */}
        <motion.a
          href="https://github.com/skvalt/voice-shopping-assistant"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-indigo-400 transition"
          whileHover={{ scale: 1.6, y: -6 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaGithub size={24} />
        </motion.a>

        {/* INSTAGRAM */}
        <motion.a
          href="https://www.instagram.com/sk.ok05/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-indigo-400 transition"
          whileHover={{ scale: 1.6, y: -6 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaInstagram size={24} />
        </motion.a>

      </div>

      Made with ❤️ for smart shoppers  
      <br />
      <span className="text-gray-500">@shivam</span>
    </div>
  );
}

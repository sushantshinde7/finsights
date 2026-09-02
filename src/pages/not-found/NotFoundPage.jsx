import { useNavigate } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import { fadeUp, staggerContainer, EASE } from "../../lib/motion";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <MotionConfig reducedMotion="user">
      <div className="error-page-container">
        {/* Left as a plain, unanimated div — it's a barely-visible
        3%-opacity texture, not worth the risk of Framer's inline
        opacity clobbering the CSS-declared one. */}
        <div className="error-page-bg-pattern"></div>

        <motion.div
          className="error-page-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.12)}
        >
          {/* One-time fade + scale replacing the old infinite bounce —
          still gives the 404 a bit of character without looping forever. */}
          <motion.h1
            className="error-page-code"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            404
          </motion.h1>

          <motion.h2 className="error-page-title" variants={fadeUp}>
            Page not found
          </motion.h2>

          <motion.p className="error-page-message" variants={fadeUp}>
            Sorry, we couldn’t find the page you’re looking for. It might have
            been moved, deleted, or never existed.
          </motion.p>

          <motion.div className="error-page-actions" variants={fadeUp}>
            <button onClick={() => navigate("/")} className="error-btn-primary">
              Go Back Home
            </button>

            <button onClick={() => navigate(-1)} className="error-btn-secondary">
              Previous Page
            </button>
          </motion.div>
        </motion.div>
      </div>
    </MotionConfig>
  );
};

export default NotFoundPage;
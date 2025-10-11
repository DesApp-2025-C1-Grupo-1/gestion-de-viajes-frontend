import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

export const LoadingOverlay = ({ active }: { active: boolean }) => {
  if (!active) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <CircularProgress size={40} />
        <p className="mt-3 text-gray-600 font-medium">Cargando...</p>
      </div>
    </motion.div>
  );
};
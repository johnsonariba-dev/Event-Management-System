
interface ButtonProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: string;
}

const Button: React.FC<ButtonProps> = ({ title, icon, className, onClick, type }) => {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors duration-200 bg-primary text-white hover:bg-secondary ${className ?? ""}`}
    >
      {title} {icon} {type}
    </button>
  );
};

export default Button;

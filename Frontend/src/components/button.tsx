
interface ButtonProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  onclick: () => void
}

const Button: React.FC<ButtonProps> = ({ title, icon, className, onclick }) => {
  return (
    <button 
      onClick={onclick}
      className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors duration-200 bg-primary text-white hover:bg-secondary ${className ?? ""}`}
    >
      {title} {icon}
    </button>
  );
};

export default Button;

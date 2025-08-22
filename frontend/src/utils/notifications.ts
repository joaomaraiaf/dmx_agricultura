import { toast, Bounce } from 'react-toastify';

const config = {
    position: "top-right" as const,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light" as const,
    transition: Bounce,
};

export const notify = {
    success: (message: string) => toast.success(message, config),
    error: (message: string) => toast.error(message, config),
    info: (message: string) => toast.info(message, config),
    warning: (message: string) => toast.warning(message, config),
};
"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/_hooks/useApi";
import { useAuth } from "@/_hooks/useAuth";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "@/_utils/notifications";

export default function Login() {
  const { request, loading, error } = useApi();
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      notify.success("Por favor, preencha todos os campos!");
      return;
    }

    try {
      const response = await request("post", "/auth/login", {
        email,
        password,
      });

      if (response?.token) {
        const userData = {
          id: response.user?.id || 1,
          email: email,
          name: response.user?.name || "Usuário"
        };

        login(response.token, userData);

        notify.success("Login realizado com sucesso!");

        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err) {
      notify.error("Usuário ou senha incorreto!");
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!registerName || !registerEmail || !registerPassword) {
      notify.error("Por favor, preencha todos os campos!");
      return;
    }

    try {
      const response = await request("post", "/auth/register", {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });

      if (response) {
        notify.success("Usuário criado com sucesso!");
        setShowModal(false);
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
      }
    } catch (err) {
      notify.error("Usuário já cadastrado!");
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-stone-500">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <svg
          width="200"
          height="70"
          viewBox="0 0 745 175"
          className="mx-auto h-20 w-auto"
          aria-label="DMX Logo"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M295.85,9.95L295.85,148.1C295.85,155.47 295.74,162.84 295.89,170.21C295.95,173.17 294.99,174.25 291.94,174.2C281.35,174.05 270.75,173.96 260.17,174.24C255.94,174.35 255.91,172.17 255.92,169.12C255.97,136.73 255.94,104.33 255.94,71.94C255.94,49.83 256.05,27.72 255.84,5.62C255.8,1.31 257.13,0.22 261.3,0.25C283.86,0.44 306.43,0.46 329,0.23C333.14,0.19 334.46,1.69 335.3,5.43C347.25,59.02 359.33,112.58 371.39,166.14C371.58,167 371.86,167.84 372.44,169.91C376.12,153.58 379.54,138.44 382.95,123.3C391.85,83.8 400.79,44.32 409.54,4.79C410.35,1.11 411.9,0.24 415.4,0.26C438.12,0.4 460.84,0.43 483.56,0.23C487.7,0.19 488.66,1.47 488.65,5.45C488.53,60.1 488.57,114.76 488.55,169.41C488.55,170.76 488.4,172.11 488.29,173.9C486.47,173.99 484.84,174.15 483.21,174.15C473.54,174.17 463.86,173.97 454.2,174.25C450.06,174.37 448.47,173.27 448.67,168.93C448.99,161.88 448.75,154.81 448.75,147.75C448.76,103.23 448.78,58.71 448.79,14.18C448.79,13.28 448.79,12.37 448.02,11.38C445.54,22.33 443.05,33.28 440.58,44.24C431.26,85.68 421.87,127.11 412.74,168.6C411.74,173.16 409.87,174.31 405.41,174.27C383,174.04 360.58,174.06 338.17,174.26C334.25,174.3 332.98,172.92 332.17,169.3C320.54,117.06 308.77,64.84 297.02,12.63C296.82,11.74 296.54,10.88 296.29,10L295.84,9.96L295.85,9.95Z"
            fill="white"
          />
          <g>
            <path
              d="M197.91,0L232.8,34.4L232.8,139.55L197.91,173.46L34.4,173.46L34.4,139.55L198.89,139.55L198.89,34.89L34.4,34.89L34.4,0L197.91,0Z"
              fill="white"
            />
            <rect x="0" y="34.4" width="34.4" height="139.06" fill="white" />
          </g>
          <g>
            <path
              d="M619.16,47.73L663.49,0.23L744.32,0.23L700.39,47.73L619.16,47.73Z"
              fill="white"
            />
            <path
              d="M511.68,174.17L556.01,126.68L636.34,126.68L592.41,174.17L511.68,174.17Z"
              fill="white"
            />
            <path
              d="M735.58,173.98L574.9,0.23L520.42,0.23L680.71,173.98L735.58,173.98Z"
              fill="white"
            />
          </g>
        </svg>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Entrar na sua conta</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
                Senha
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>

        <ToastContainer />

        <p className="mt-3 text-center text-sm/6 text-gray-400">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Criar conta
          </button>
        </p>

        <div id="authentication-modal" tabIndex={-1} aria-hidden="true" className={`${showModal ? "flex" : "hidden"} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Registrar-se
                </h3>
                <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal" onClick={() => setShowModal(false)}>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Fechar</span>
                </button>
              </div>

              <div className="p-4 md:p-5">
                <form onSubmit={handleRegister} className="space-y-4" action="#">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seu Nome</label>
                    <input
                      onChange={(e) => setRegisterName(e.target.value)}
                      type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Seu Nome" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seu Email</label>
                    <input
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="email@email.com" required />
                  </div>
                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sua Senha</label>
                    <input
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                  </div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Criar conta</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

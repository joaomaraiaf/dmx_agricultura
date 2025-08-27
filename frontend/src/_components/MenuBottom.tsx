"use client";

import { useAuth } from "@/_hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MenuBottom() {
    const { logout } = useAuth();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const go = (path: string) => {
        router.push(path);
    };

    if (collapsed) {
        return (
            <div className="fixed z-[1000] bottom-4 right-4">
                <button
                    type="button"
                    onClick={() => setCollapsed(false)}
                    className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white border border-stone-200 shadow-lg transition-transform duration-500 ease-in-out hover:scale-105"
                    aria-label="Mostrar menu"
                >
                    <svg className="w-6 h-6 text-stone-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12h18" />
                        <path d="M3 6h18" />
                        <path d="M3 18h18" />
                    </svg>
                </button>
            </div>
        );
    }

    return (
        <div className="fixed z-[1000] w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-stone-200 rounded-full bottom-4 left-1/2 shadow-lg transition-all duration-500 ease-in-out">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
                <button
                    data-tooltip-target="tooltip-home"
                    type="button"
                    onClick={() => go("/dashboard")}
                    className="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-stone-100 group"
                >
                    <svg className="w-5 h-5 mb-1 text-stone-600 group-hover:text-stone-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    <span className="sr-only">Início</span>
                </button>
                <div id="tooltip-home" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-stone-800 rounded-lg shadow-lg opacity-0 tooltip">
                    Início
                    <div className="tooltip-arrow" data-popper-arrow></div>
                </div>

                <button
                    data-tooltip-target="tooltip-plots"
                    type="button"
                    onClick={() => go("/plots")}
                    className="inline-flex flex-col items-center justify-center px-5 hover:bg-stone-100 group"
                >
                    <svg className="w-5 h-5 mb-1 text-stone-600 group-hover:text-stone-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="sr-only">Talhões</span>
                </button>
                <div id="tooltip-plots" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-stone-800 rounded-lg shadow-lg opacity-0 tooltip">
                    Talhões
                    <div className="tooltip-arrow" data-popper-arrow></div>
                </div>

                <div className="flex items-center justify-center">
                    <button data-tooltip-target="tooltip-new" type="button" className="inline-flex items-center justify-center w-20 h-10 font-medium bg-stone-600 rounded-full hover:bg-stone-700 group focus:ring-4 focus:ring-stone-300 focus:outline-none">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <svg
                                width="200"
                                height="70"
                                viewBox="0 0 745 175"
                                className="mx-auto h-5 w-auto"
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
                        </div>
                    </button>
                </div>
                <div id="tooltip-new" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-stone-800 rounded-lg shadow-lg opacity-0 tooltip">
                    DMX
                    <div className="tooltip-arrow" data-popper-arrow></div>
                </div>

                <button
                    data-tooltip-target="tooltip-user"
                    type="button"
                    onClick={() => logout()}
                    className="inline-flex flex-col items-center justify-center px-5 hover:bg-stone-100 group"
                >
                    <svg className="w-5 h-5 mb-1 text-stone-600 group-hover:text-stone-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="sr-only">Sair</span>
                </button>
                <div id="tooltip-user" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-stone-800 rounded-lg shadow-lg opacity-0 tooltip">
                    Sair
                    <div className="tooltip-arrow" data-popper-arrow></div>
                </div>

                <button
                    data-tooltip-target="tooltip-hide"
                    type="button"
                    onClick={() => setCollapsed(true)}
                    className="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-stone-100 group"
                >
                    <svg className="w-5 h-5 mb-1 text-stone-600 group-hover:text-stone-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.94 10.94 0 0112 20C7 20 2.73 16.11 1 12c.67-1.57 1.67-3.03 2.94-4.29M9.9 4.24A10.39 10.39 0 0112 4c5 0 9.27 3.89 11 8-1 2.35-2.6 4.44-4.64 6.06M1 1l22 22" />
                    </svg>
                    <span className="sr-only">Esconder menu</span>
                </button>
                <div id="tooltip-hide" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-stone-800 rounded-lg shadow-lg opacity-0 tooltip">
                    Esconder menu
                    <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
            </div>
        </div>
    );
}
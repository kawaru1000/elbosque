
import React from 'react';
import { Booking } from '../types';

interface ConfirmationProps {
    booking: Booking | null;
    onConfirm: () => void;
    onReset: () => void;
    isLoading: boolean;
    emailContent: string;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        <p className="ml-3">Generando confirmación...</p>
    </div>
);


const Confirmation: React.FC<ConfirmationProps> = ({ booking, onConfirm, onReset, isLoading, emailContent }) => {
    
    if (!booking) {
        return <div className="text-center">Error: Faltan datos de la reserva.</div>;
    }

    const formattedDate = new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(booking.time);
    
    if (emailContent) {
        return (
            <div className="text-center">
                 <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-500 rounded-full mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                 </div>
                <h2 className="text-3xl font-bold text-green-400 mb-2">¡Reserva Confirmada!</h2>
                <p className="text-gray-300 mb-6">Se ha enviado un correo de notificación a <span className="font-semibold">manuelsanchez@jerez.es</span>.</p>
                
                <div className="bg-gray-700 p-4 rounded-lg text-left my-6 max-w-2xl mx-auto">
                    <h3 className="font-semibold text-lg mb-2 text-cyan-400">Contenido del Correo de Notificación:</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{emailContent}</p>
                </div>

                <button
                    onClick={onReset}
                    className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-md transition-colors"
                >
                    Hacer una Nueva Reserva
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold text-center mb-6 text-cyan-400">Confirme su Reserva</h2>
            <div className="bg-gray-700 p-6 rounded-lg max-w-lg mx-auto space-y-4">
                <div className="flex justify-between">
                    <span className="text-gray-400">Profesional:</span>
                    <span className="font-semibold">{booking.staff.name}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-400">Servicio:</span>
                    <span className="font-semibold">{booking.service.name}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-400">Fecha y Hora:</span>
                    <span className="font-semibold">{formattedDate}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-400">Cliente:</span>
                    <span className="font-semibold">{booking.customerName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="font-semibold">{booking.customerEmail}</span>
                </div>
                 <div className="border-t border-gray-600 my-4"></div>
                <div className="flex justify-between text-xl">
                    <span className="text-gray-300">Total:</span>
                    <span className="font-bold text-cyan-400">{booking.service.price}€</span>
                </div>
            </div>
            <div className="text-center mt-8">
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <button
                        onClick={onConfirm}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-md transition-colors text-lg"
                    >
                        Confirmar y Reservar
                    </button>
                )}
            </div>
        </div>
    );
};

export default Confirmation;
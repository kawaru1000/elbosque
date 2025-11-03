
import React from 'react';
import { Service } from '../types';

interface ServiceSelectorProps {
    services: Service[];
    onSelectService: (service: Service) => void;
    staffName: string;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ services, onSelectService, staffName }) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-center mb-6 text-cyan-400">Servicios ofrecidos por {staffName}</h2>
            {services.length > 0 ? (
                <ul className="space-y-3">
                    {services.map((service) => (
                        <li
                            key={service.id}
                            onClick={() => onSelectService(service)}
                            className="bg-gray-700 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-600 transition-colors duration-200"
                        >
                            <div>
                                <h3 className="font-semibold text-lg">{service.name}</h3>
                                <p className="text-gray-400 text-sm">{service.duration} min</p>
                            </div>
                            <span className="font-bold text-xl text-cyan-400">{service.price}€</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-400">Este profesional no tiene servicios asignados.</p>
            )}
        </div>
    );
};

export default ServiceSelector;

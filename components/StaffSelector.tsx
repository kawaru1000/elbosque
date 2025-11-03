
import React from 'react';
import { Staff } from '../types';

interface StaffSelectorProps {
    staffMembers: Staff[];
    onSelectStaff: (staff: Staff) => void;
}

const StaffSelector: React.FC<StaffSelectorProps> = ({ staffMembers, onSelectStaff }) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-center mb-6 text-cyan-400">Seleccione un Profesional</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {staffMembers.map((staff) => (
                    <div
                        key={staff.id}
                        onClick={() => onSelectStaff(staff)}
                        className="bg-gray-700 rounded-lg p-4 text-center cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-cyan-500/50"
                    >
                        <img
                            src={staff.avatarUrl}
                            alt={staff.name}
                            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-600 object-cover"
                        />
                        <h3 className="font-bold text-lg">{staff.name}</h3>
                        <p className="text-gray-400 text-sm">{staff.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffSelector;

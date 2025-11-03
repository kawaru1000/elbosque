
import React, { useState, useMemo } from 'react';
import { Staff, Service, Booking } from './types';
import { STAFF_MEMBERS, SERVICES } from './constants';
import StaffSelector from './components/StaffSelector';
import ServiceSelector from './components/ServiceSelector';
import Calendar from './components/Calendar';
import BookingForm from './components/BookingForm';
import Confirmation from './components/Confirmation';
import { generateBookingEmailContent } from './services/geminiService';

type Step = 'STAFF' | 'SERVICE' | 'TIME' | 'DETAILS' | 'CONFIRMATION';

const ProgressBar: React.FC<{ currentStep: Step }> = ({ currentStep }) => {
    const steps: { id: Step, title: string }[] = [
        { id: 'STAFF', title: 'Profesional' },
        { id: 'SERVICE', title: 'Servicio' },
        { id: 'TIME', title: 'Fecha y Hora' },
        { id: 'DETAILS', title: 'Tus Datos' },
        { id: 'CONFIRMATION', title: 'Confirmación' },
    ];
    const currentIndex = steps.findIndex(step => step.id === currentStep);

    return (
        <div className="flex justify-between items-center mb-8">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${index <= currentIndex ? 'bg-cyan-500' : 'bg-gray-700 border-2 border-gray-600'}`}>
                            {index < currentIndex ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <span>{index + 1}</span>
                            )}
                        </div>
                        <p className={`mt-2 text-xs text-center ${index <= currentIndex ? 'text-cyan-400' : 'text-gray-500'}`}>{step.title}</p>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 transition-colors duration-300 ${index < currentIndex ? 'bg-cyan-500' : 'bg-gray-700'}`}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};


const App: React.FC = () => {
    const [step, setStep] = useState<Step>('STAFF');
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    const [customerDetails, setCustomerDetails] = useState<{ name: string; email: string }>({ name: '', email: '' });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [emailContent, setEmailContent] = useState<string>('');

    const availableServices = useMemo(() => {
        if (!selectedStaff) return [];
        return SERVICES.filter(service => selectedStaff.services.includes(service.id));
    }, [selectedStaff]);

    const handleStaffSelect = (staff: Staff) => {
        setSelectedStaff(staff);
        setStep('SERVICE');
    };

    const handleServiceSelect = (service: Service) => {
        setSelectedService(service);
        setStep('TIME');
    };
    
    const handleTimeSelect = (time: Date) => {
        setSelectedTime(time);
        setStep('DETAILS');
    };
    
    const handleDetailsSubmit = (details: { name: string; email: string }) => {
        setCustomerDetails(details);
        setStep('CONFIRMATION');
    };

    const handleBookingConfirm = async () => {
        if (!selectedStaff || !selectedService || !selectedTime) return;

        const booking: Booking = {
            staff: selectedStaff,
            service: selectedService,
            time: selectedTime,
            customerName: customerDetails.name,
            customerEmail: customerDetails.email
        };

        setIsLoading(true);
        try {
            const content = await generateBookingEmailContent(booking);
            setEmailContent(content);
        } catch (error) {
            console.error("Error generating email content:", error);
            setEmailContent("Hubo un error al generar la confirmación. Por favor, intente de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const resetBooking = () => {
        setStep('STAFF');
        setSelectedStaff(null);
        setSelectedService(null);
        setSelectedTime(null);
        setCustomerDetails({ name: '', email: '' });
        setIsLoading(false);
        setEmailContent('');
    };

    const goBack = () => {
        if (step === 'SERVICE') setStep('STAFF');
        if (step === 'TIME') setStep('SERVICE');
        if (step === 'DETAILS') setStep('TIME');
        if (step === 'CONFIRMATION' && !emailContent) setStep('DETAILS');
    };

    const renderStep = () => {
        switch (step) {
            case 'STAFF':
                return <StaffSelector staffMembers={STAFF_MEMBERS} onSelectStaff={handleStaffSelect} />;
            case 'SERVICE':
                return <ServiceSelector services={availableServices} onSelectService={handleServiceSelect} staffName={selectedStaff?.name || ''}/>;
            case 'TIME':
                return <Calendar onSelectTime={handleTimeSelect} serviceDuration={selectedService?.duration || 60} />;
            case 'DETAILS':
                return <BookingForm onSubmit={handleDetailsSubmit} />;
            case 'CONFIRMATION':
                const booking = selectedStaff && selectedService && selectedTime ? {
                    staff: selectedStaff,
                    service: selectedService,
                    time: selectedTime,
                    customerName: customerDetails.name,
                    customerEmail: customerDetails.email
                } : null;
                return <Confirmation booking={booking} onConfirm={handleBookingConfirm} onReset={resetBooking} isLoading={isLoading} emailContent={emailContent} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center">
            <div className="w-full max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        RESERVAS ONLINE
                    </h1>
                    <p className="text-gray-400 mt-2">Su sistema de reservas simple y elegante.</p>
                </header>

                <main className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8">
                   {step !== 'STAFF' && emailContent === '' && (
                        <button onClick={goBack} className="mb-6 flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Volver
                        </button>
                    )}
                    <ProgressBar currentStep={step} />
                    <div className="mt-8">
                       {renderStep()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;

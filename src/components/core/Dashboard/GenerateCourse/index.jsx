import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import CourseGenerationForm from './CourseGenerationForm';
import GenerationProgress from './GenerationProgress';
import CoursePreview from './CoursePreview';

function GenerateCourse() {
    const [currentStep, setCurrentStep] = useState('form'); // 'form', 'generating', 'preview'
    const [courseFormData, setCourseFormData] = useState(null);
    const [generatedCourse, setGeneratedCourse] = useState(null);
    const navigate = useNavigate();

    const handleFormNext = (formData) => {
        console.log('Form data received:', formData);
        setCourseFormData(formData);
        setCurrentStep('generating');
    };

    const handleGenerationComplete = (courseData) => {
        console.log('Course generation completed:', courseData);
        setGeneratedCourse(courseData);
        setCurrentStep('preview');
    };

    const handleBackToForm = () => {
        setCurrentStep('form');
        setCourseFormData(null);
        setGeneratedCourse(null);
    };

    const handleBackToGeneration = () => {
        setCurrentStep('generating');
        setGeneratedCourse(null);
    };

    const handleCoursePublish = (publishedCourse) => {
        console.log('Course published successfully:', publishedCourse);
        toast.success('Course published successfully! Redirecting to My Courses...');
        
        setTimeout(() => {
            navigate('/dashboard/my-courses');
        }, 2000);
    };

    const renderStepIndicator = () => {
        const steps = [
            { id: 'form', name: 'Course Details', number: 1 },
            { id: 'generating', name: 'Generation', number: 2 },
            { id: 'preview', name: 'Preview & Publish', number: 3 }
        ];

        return (
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                                currentStep === step.id
                                    ? 'bg-yellow-50 text-richblack-900'
                                    : steps.findIndex(s => s.id === currentStep) > index
                                        ? 'bg-green-500 text-white'
                                        : 'bg-richblack-700 text-richblack-400'
                            }`}>
                                {steps.findIndex(s => s.id === currentStep) > index ? '✓' : step.number}
                            </div>
                            <div className="ml-3">
                                <p className={`text-sm font-medium ${
                                    currentStep === step.id
                                        ? 'text-yellow-50'
                                        : steps.findIndex(s => s.id === currentStep) > index
                                            ? 'text-green-400'
                                            : 'text-richblack-400'
                                }`}>
                                    {step.name}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-4 ${
                                    steps.findIndex(s => s.id === currentStep) > index
                                        ? 'bg-green-500'
                                        : 'bg-richblack-700'
                                }`}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-richblack-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-richblack-5 mb-2">
                        AI Course Generator
                    </h1>
                    <p className="text-richblack-300">
                        Create comprehensive courses with AI assistance. Our AI will generate content, 
                        find relevant videos, and help you build engaging educational experiences.
                    </p>
                </div>

                {/* Step Indicator */}
                {renderStepIndicator()}

                {/* Step Content */}
                <div className="min-h-[600px]">
                    {currentStep === 'form' && (
                        <CourseGenerationForm onNext={handleFormNext} />
                    )}

                    {currentStep === 'generating' && (
                        <GenerationProgress
                            courseData={courseFormData}
                            onComplete={handleGenerationComplete}
                            onBack={handleBackToForm}
                        />
                    )}

                    {currentStep === 'preview' && (
                        <CoursePreview
                            courseData={generatedCourse}
                            onBack={handleBackToGeneration}
                            onPublish={handleCoursePublish}
                        />
                    )}
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center text-richblack-400 text-sm">
                    <p>
                        Powered by advanced AI technology • Thumbnails by{' '}
                        <a 
                            href="https://unsplash.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-yellow-50 hover:underline"
                        >
                            Unsplash
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default GenerateCourse;
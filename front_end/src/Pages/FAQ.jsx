import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Upload } from 'lucide-react';

const SupportFeedback = () => {
    const [formData, setFormData] = useState({
        message: '',
        name: '',
        email: ''
    });

    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const faqs = [
        { id: 1, question: "How do I verify my email?" },
        { id: 2, question: "My Pen loads infinitely or crashes the browser" },
        { id: 3, question: "How do I contact the creator of a Pen?" },
        { id: 4, question: "What version of [library] does CodePen use?" },
        { id: 5, question: "What are forks?" },
        { id: 6, question: "Receipts, account cancellation and more" }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Thank you for your feedback! We\'ll get back to you soon.');
    };

    const toggleFAQ = (id) => {
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Support / FeedBack</h1>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Contact Support Section */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-6">Contact Support</h2>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-3">Did you try the documentation</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                We have lots of information available in{' '}
                                <span className="text-blue-400 underline cursor-pointer">our documentation</span>{' '}
                                that might help you with your issue. If you don't find your answer there, send us a message. We're happy to help!
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Message <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Describe your issue or feedback..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Email <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>

                            <div className="pt-2">
                                <p className="text-sm text-gray-400 mb-3">A screenshot or screen recording can be super helpful!</p>

                                <div className="relative">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*,video/*"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer transition-colors"
                                    >
                                        <Upload className="w-4 h-4" />
                                        {selectedFile ? selectedFile.name : 'Choose file'}
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                                Submit
                            </button>
                        </form>
                    </div>

                    {/* FAQs Section */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-6">FAQs</h2>

                        <div className="space-y-3">
                            {faqs.map((faq) => (
                                <div key={faq.id} className="border-b border-gray-700 last:border-b-0">
                                    <button
                                        onClick={() => toggleFAQ(faq.id)}
                                        className="w-full flex items-center justify-between py-3 text-left hover:text-blue-400 transition-colors group"
                                    >
                                        <span className="text-sm font-medium pr-4">{faq.question}</span>
                                        {expandedFAQ === faq.id ? (
                                            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-400 flex-shrink-0" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400 flex-shrink-0" />
                                        )}
                                    </button>

                                    {expandedFAQ === faq.id && (
                                        <div className="pb-3 pl-4 text-sm text-gray-300">
                                            <p>This is where the answer to "{faq.question}" would appear. Click to expand and view detailed information about this topic.</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportFeedback;
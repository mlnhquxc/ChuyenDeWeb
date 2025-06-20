import React from 'react';
import { Users, Target, Award, TrendingUp, Heart, Shield, Zap, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
    const { t } = useTranslation();
    const stats = [
        { number: '500+', label: 'Happy Customers', icon: Users },
        { number: '50+', label: 'Projects Completed', icon: Target },
        { number: '5+', label: 'Years Experience', icon: Award },
        { number: '99%', label: 'Success Rate', icon: TrendingUp }
    ];

    const values = [
        {
            icon: Heart,
            title: 'Customer First',
            description: 'We prioritize our customers\' needs and satisfaction above everything else.'
        },
        {
            icon: Shield,
            title: 'Quality Assurance',
            description: 'Every product we deliver meets the highest standards of quality and reliability.'
        },
        {
            icon: Zap,
            title: 'Innovation',
            description: 'We constantly innovate and adopt the latest technologies to serve you better.'
        },
        {
            icon: Globe,
            title: 'Global Reach',
            description: 'Our services span across multiple regions, connecting people worldwide.'
        }
    ];

    const team = [
        {
            name: 'John Smith',
            role: 'CEO & Founder',
            image: '👨‍💼',
            description: 'Visionary leader with 10+ years in tech industry'
        },
        {
            name: 'Sarah Johnson',
            role: 'CTO',
            image: '👩‍💻',
            description: 'Technical expert specializing in modern web technologies'
        },
        {
            name: 'Mike Chen',
            role: 'Lead Designer',
            image: '👨‍🎨',
            description: 'Creative mind behind our beautiful user interfaces'
        },
        {
            name: 'Emily Davis',
            role: 'Marketing Director',
            image: '👩‍💼',
            description: 'Strategic marketer driving our brand growth'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Hero Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">About Us</h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        We are a passionate team dedicated to creating exceptional digital experiences
                        that transform businesses and delight users around the world.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-800 rounded-2xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <p className="text-lg">
                                Founded in 2019, our company began as a small startup with a big vision:
                                to bridge the gap between innovative technology and meaningful user experiences.
                                What started as a two-person team working from a garage has grown into a
                                thriving organization serving clients worldwide.
                            </p>
                            <p className="text-lg">
                                Our journey has been marked by continuous learning, adaptation, and an
                                unwavering commitment to excellence. We believe that great products are
                                born from understanding our users' needs and crafting solutions that not
                                only meet but exceed their expectations.
                            </p>
                            <p className="text-lg">
                                Today, we're proud to be a trusted partner for businesses looking to
                                establish their digital presence and create lasting connections with their audiences.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Achievements</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-gray-800 rounded-2xl p-8 text-center hover:bg-gray-750 transition-colors">
                                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-4xl font-bold text-green-400 mb-2">{stat.number}</div>
                                <div className="text-gray-300 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-gray-800 rounded-2xl p-8 hover:bg-gray-750 transition-colors">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                                    <value.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                                <p className="text-gray-300 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="bg-gray-800 rounded-2xl p-6 text-center hover:bg-gray-750 transition-colors">
                                <div className="text-6xl mb-4">{member.image}</div>
                                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                                <div className="text-green-400 font-medium mb-4">{member.role}</div>
                                <p className="text-gray-300 text-sm leading-relaxed">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 md:p-12 text-center">
                        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                        <p className="text-xl leading-relaxed">
                            To empower businesses with innovative digital solutions that drive growth,
                            enhance user experiences, and create lasting value in an ever-evolving digital landscape.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Work With Us?</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Let's collaborate and bring your vision to life. We're excited to hear about your project!
                    </p>
                    <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                        Get In Touch
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
import React from 'react';

const AboutPage = () => {
    return (
        <div className="bg-orange-50">
            {/* Hero Section */}
            <div
                className="relative bg-cover bg-center py-24"
                
                    style={{ backgroundImage: 'linear-gradient(rgba(42, 22, 6, 0.6), rgba(42, 22, 6, 0.6)), url(https://www.artudaipur.com/cdn/shop/products/RajasthaniPainting_62c40fd7-5648-4c4f-ad9e-a9e3596d5ef5.jpg?v=1629048455)' }}
                
            >
                <div className="container mx-auto px-6 text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif">About KalaKriti</h1>
                    <p className="text-lg mt-2">Celebrating the rich heritage of Indian folk art.</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-16">
                {/* Our Mission Section */}
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-12 text-center">
                    <h2 className="text-3xl font-bold text-orange-900 mb-4 font-serif">Our Mission</h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                        KalaKriti is dedicated to preserving and promoting the diverse forms of Indian folk art, connecting traditional artists with art enthusiasts worldwide. We believe in the power of cultural expression and the importance of keeping these ancient art forms alive for future generations.
                    </p>
                </div>

                {/* Core Values Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center transition-transform hover:-translate-y-2">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Preserve Heritage</h3>
                        <p className="text-gray-600">
                            We work to preserve traditional Indian folk art forms and support the artists who keep these traditions alive.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-8 text-center transition-transform hover:-translate-y-2">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Empower Artists</h3>
                        <p className="text-gray-600">
                            We connect talented folk artists with art lovers, collectors, and enthusiasts from around the world.
                        </p>
                    </div>
                </div>

                {/* Art Forms Section */}
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-orange-900 mb-8 text-center font-serif">Art Forms We Support</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Warli Art</h3>
                            <p className="text-gray-600">
                                Traditional tribal art from Maharashtra, characterized by simple geometric shapes and depictions of daily life.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Pithora Art</h3>
                            <p className="text-gray-600">
                                Ritualistic art form from Gujarat, featuring vibrant colors and mythological themes.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Madhubani Art</h3>
                            <p className="text-gray-600">
                                Ancient art form from Bihar, known for its intricate patterns and religious motifs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;

import React from 'react';

const AboutPage = () => {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-orange-900 mb-4">About KalaKriti</h1>
                <p className="text-xl text-gray-600">Celebrating the rich heritage of Indian folk art</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-orange-900 mb-6">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    KalaKriti is dedicated to preserving and promoting the diverse forms of Indian folk art, 
                    connecting traditional artists with art enthusiasts worldwide. We believe in the power of 
                    cultural expression and the importance of keeping these ancient art forms alive for future generations.
                </p>
                <p className="text-gray-700 leading-relaxed">
                    Our platform serves as a bridge between the rich artistic heritage of India and the global 
                    art community, fostering appreciation for the intricate beauty and cultural significance of 
                    folk art traditions.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Preserve Heritage</h3>
                    <p className="text-gray-600 text-center">
                        We work to preserve traditional Indian folk art forms and support the artists who keep these traditions alive.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Connect Artists</h3>
                    <p className="text-gray-600 text-center">
                        We connect talented folk artists with art lovers, collectors, and enthusiasts from around the world.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-orange-900 mb-6">Art Forms We Support</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-l-4 border-orange-500 pl-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Warli Art</h3>
                        <p className="text-gray-600">
                            Traditional tribal art from Maharashtra, characterized by simple geometric shapes and depictions of daily life.
                        </p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pithora Art</h3>
                        <p className="text-gray-600">
                            Ritualistic art form from Gujarat, featuring vibrant colors and mythological themes.
                        </p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Madhubani Art</h3>
                        <p className="text-gray-600">
                            Ancient art form from Bihar, known for its intricate patterns and religious motifs.
                        </p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Other Forms</h3>
                        <p className="text-gray-600">
                            We also support various other regional folk art forms from across India.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl p-8 text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
                <p className="text-orange-100 mb-6">
                    Whether you're an artist looking to showcase your work or an art lover seeking unique pieces, 
                    KalaKriti is the perfect platform for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-white text-orange-800 font-bold py-3 px-6 rounded-lg hover:bg-orange-50 transition-colors">
                        Start Creating
                    </button>
                    <button className="border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:text-orange-800 transition-colors">
                        Explore Gallery
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutPage; 
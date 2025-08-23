import React from 'react';

const Footer = () => (
    <footer className="bg-orange-50 border-t border-orange-200 mt-16">
        <div className="container mx-auto px-6 py-8 text-center text-gray-700">
            <p className="text-2xl font-bold text-orange-900 font-serif mb-2">KalaKriti</p>
            <p>Preserving and Promoting India's Folk Art Heritage.</p>
            <div className="flex justify-center space-x-6 my-4">
                <a href="#" className="hover:text-orange-800">Facebook</a>
                <a href="#" className="hover:text-orange-800">Instagram</a>
                <a href="#" className="hover:text-orange-800">Twitter</a>
            </div>
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} KalaKriti. All Rights Reserved.</p>
        </div>
    </footer>
);

export default Footer;
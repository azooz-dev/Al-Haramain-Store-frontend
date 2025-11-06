import React from 'react';
import { Link } from 'react-router-dom';


const Logo: React.FC = () => (
<Link to="/" className="flex items-center cursor-pointer group flex-shrink-0 gap-2 space-x-2 ml-2">
<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-lg group-hover:scale-105 transition-transform">
ح
</div>
<div className="text-xl text-foreground whitespace-nowrap mx-[3px] my-[0px]">Al-Haramain</div>
</Link>
);


export default Logo;
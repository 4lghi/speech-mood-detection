import angry from '../assets/fear.svg';
import back from '../assets/back.svg'

export default function FearPage() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center relative px-6 bg-[#B891E9]">

      <button className="absolute top-6 left-6 text-black text-3xl font-bold">
        <img src={back} alt="back" className="w-[50px] h-[50px]" />
      </button>

      {/* Mood layout */}
      <div className="flex gap-8 mb-10">
        <Mood />
        <Mood />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-black text-center mb-3">
        Tidak apa-apa untuk menjauh dari hal yang <br />membuatmu tidak nyaman.
      </h1>
    
    </div>
  );
}

function Mood() {
  return (
    <div className="flex items-center justify-center">
        <img src={fear} alt="fear" className="w-[150px] h-[150px]" />
    </div>
  );
}
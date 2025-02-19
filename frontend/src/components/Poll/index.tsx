import React, {ReactElement, useState} from 'react';

export interface PollProps {
  id: number,
  title: string;
  description: string;
  num: number;
  options: Option[];
}

interface Option {
  id: number,
  text: string,
  num: number,
}

const Poll = ({id: pollId, title, description, num: totalNum, options}: PollProps): ReactElement => {
  const [cachedOptions, setCachedOptions] = useState<Option[]>(options);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleCheckboxChange = (id: number) => {
    setSelectedOption(id);
  };

  const handleVote = () => {
    if (selectedOption !== null) {
      setCachedOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.id === selectedOption
            ? {...option, num: option.num + 1}
            : option
        )
      );
      setSelectedOption(null);
    }
  };

  const PollOption: React.FC<{ option: Option }> = ({ option }) => {
    const percentage = totalNum
      ? Math.round((option.num / totalNum) * 100)
      : 0;

    return (
      <div className="space-y-1">
        <div
          key={option.id}
          className="flex items-center justify-between space-x-4"
        >
          {/* 체크박스와 라벨 */}
          <label className="flex items-center space-x-2">
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-full border-4 ${
                selectedOption === option.id
                  ? 'bg-yellow-400 border-yellow-400'
                  : 'bg-white border-gray-300'
              }`}
              onClick={() => handleCheckboxChange(option.id)}
            >
              {selectedOption === option.id && (
                <div className="w-3 h-3 bg-white rounded-full"></div>
              )}
            </div>
            <span className="text-md">{option.text}</span>
          </label>
          {/* 투표 수 */}
          <div className="text-gray-700">{option.num}명</div>
        </div>
        {/* 막대바 */}
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full"
            style={{width: `${percentage}%`}}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-sm mb-2">✅ 진행 중인 투표</h1>
      <h2 className="px-1 text-xl font-bold mb-2">{title}</h2>
      {description.length > 0 && <p className="px-1 mb-2"> {description} </p>}
      {/* 선택지 */}
      <div className="border rounded-md p-2 space-y-4">
        {options.map((option: Option) => (
          <PollOption key={option.id} option={option} />
        ))}
      </div>

      {/* 투표하기 버튼 */}
      <button
        className={`mt-3 w-full py-2 text-white font-bold rounded-md ${
          selectedOption === null
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gray-800 hover:bg-gray-600'
        }`}
        disabled={selectedOption === null}
        onClick={handleVote}
      >
        투표하기
      </button>
      <p className="text-right mt-2 text-gray-500">
        <span className="font-bold">{totalNum}</span>명 참여
      </p>
    </div>
  );
};

export default Poll;

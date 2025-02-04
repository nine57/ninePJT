import React, {useState} from 'react';

const defaultOptions: Option[] = [
  {id: 1, label: 'Option 1', votes: 10},
  {id: 2, label: 'Option 2', votes: 20},
  {id: 3, label: 'Option 3', votes: 15},
]

const defaultTitle: string = '✅ 투표 제목';


interface Option {
  id: number,
  label: string,
  votes: number,
}

const Vote: React.FC = () => {
  const [options, setOptions] = useState<Option[]>(defaultOptions);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

  const handleCheckboxChange = (id: number) => {
    setSelectedOption(id);
  };

  const handleVote = () => {
    if (selectedOption !== null) {
      setOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.id === selectedOption
            ? {...option, votes: option.votes + 1}
            : option
        )
      );
      setSelectedOption(null); // Reset selection after voting
    }
  };

  const VoteOption: React.FC<{ option: Option }> = ({ option }) => {
    const percentage = totalVotes
      ? Math.round((option.votes / totalVotes) * 100)
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
            <span className="text-md">{option.label}</span>
          </label>
          {/* 투표 수 */}
          <div className="text-gray-700">{option.votes}명</div>
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
    <div className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-6">{defaultTitle}</h2>
      {/* 선택지 */}
      <div className="space-y-4">
        {options.map((option: Option) => (
          <VoteOption key={option.id} option={option} />
        ))}
      </div>

      {/* 투표하기 버튼 */}
      <button
        className={`mt-6 w-full py-2 text-white font-bold rounded-lg ${
          selectedOption === null
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gray-600 hover:bg-gray-800'
        }`}
        disabled={selectedOption === null}
        onClick={handleVote}
      >
        투표하기
      </button>
      <p className="text-right mt-2 text-gray-500">
        <span className="font-bold">{totalVotes}</span>명 참여
      </p>
    </div>
  );
};

export default Vote;

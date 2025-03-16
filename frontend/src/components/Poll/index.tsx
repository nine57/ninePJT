import React, {ReactElement, useEffect, useState} from 'react';

import GrayCheckIcon from '../../assets/PokerFace/check-g-icon.svg';
import YellowCheckIcon from '../../assets/PokerFace/check-y-icon.svg';

export interface Option {
  id: number;
  text: string;
  voteCount: number;
  isVoted: boolean;
}

export interface Poll {
  id: number;
  title: string;
  description: string;
  voteCount: number;
  options: Option[];
  isVoted: boolean;
}

export interface Props {
  poll: Poll;
  onVote: (optionIds: number[]) => void;
}

const PollCard = ({ poll, onVote }: Props): ReactElement => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isVotable, setIsVotable] = useState<boolean>(false);

  useEffect(() => {
    const selectedIds = poll.options
      .filter(option => option.isVoted)
      .map(option => option.id);

    setSelectedOptions(selectedIds);
    setIsVotable(!poll.isVoted);
  }, [poll]);

  const handleCheckboxChange = (id: number) => {
    setSelectedOptions(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(optionId => optionId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleVote = () => {
    if (selectedOptions.length > 0) {
      onVote(selectedOptions);
      setIsVotable(false);
    }
  };

  const handleResetVote = () => {
    setIsVotable(true);
    setSelectedOptions([]);
  };

  const CheckIcon = !isVotable ? GrayCheckIcon : YellowCheckIcon;

  const PollOption: React.FC<{ option: Option }> = ({ option }) => {
    const percentage = poll.voteCount
      ? Math.round((option.voteCount / poll.voteCount) * 100)
      : 0;

    return (
      <div className="space-y-1">
        <div
          key={`${poll.id}-${option.id}`}
          className="flex items-center justify-between space-x-4"
        >
          {/* 체크박스와 라벨 */}
          <label className="flex items-center space-x-2">
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
                selectedOptions.includes(option.id)
                  ? !isVotable
                    ? 'bg-gray-300 border-gray-300'
                    : 'bg-yellow-400 border-yellow-400'
                  : 'bg-white border-gray-300'
              }`}
              onClick={isVotable ? () => handleCheckboxChange(option.id): undefined}
            >
              {selectedOptions.includes(option.id) && (
                <img src={CheckIcon} alt="Checked" className="w-full h-full"/>
              )}
            </div>
            <span className="text-md">{option.text}</span>
          </label>
          {/* 투표 수 */}
          <div className="text-gray-700">{option.voteCount}명</div>
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
      <h2 className="px-1 text-xl font-bold mb-2">{poll.title}</h2>
      {poll.description.length > 0 && <p className="px-1 mb-2"> {poll.description} </p>}

      <div className="border rounded-md p-2">
        {/* 선택지 */}
        <div className="py-1 space-y-4">
          {poll.options.map((option: Option) => (
            <PollOption key={`${poll.id}-${option.id}`} option={option} />
          ))}
        </div>

        {/* 버튼 */}
        {!isVotable ? (
          <button
            className='mt-3 w-full py-2 text-white font-bold rounded-md bg-gray-800 hover:bg-gray-600 active:bg-gray-400'
            onClick={handleResetVote}
          >
            다시 투표하기
          </button>
        ) : (
          <button
            className={`mt-3 w-full py-2 text-white font-bold rounded-md ${
              !isVotable
                ? 'bg-gray-300 cursor-not-allowed'
                : selectedOptions.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gray-800 hover:bg-gray-600 active:bg-gray-400'
            }`}
            disabled={selectedOptions.length === 0}
            onClick={handleVote}
          >
            투표하기
          </button>
        )}

        <p className="text-right mt-2 text-gray-500">
          <span className="font-bold">{poll.voteCount}</span>명 참여
        </p>
      </div>
    </div>
  );
};

export default PollCard;

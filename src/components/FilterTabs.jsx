import React from 'react';

const FilterTabs = ({ currentFilter, setCurrentFilter }) => {
  const tabs = [
    { id: 'all', label: '전체' },
    { id: 'active', label: '진행 중' },
    { id: 'completed', label: '완료' },
  ];

  return (
    <section className="mb-6">
      <div className="flex bg-[#f1f3f5] p-1 rounded-xl gap-1">
        {tabs.map((tab) => {
          const isActive = currentFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentFilter(tab.id)}
              className={`flex-1 py-2.5 rounded-lg text-[0.9rem] font-medium text-center transition-all duration-250 cursor-pointer ${
                isActive
                  ? 'bg-white text-primary font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default FilterTabs;

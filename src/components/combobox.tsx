import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/combobox.module.css';

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ReusableComboboxProps {
  options: ComboboxOption[];
  selectedValue?: string;
  placeholder?: string;
  onSelect: (value: string) => void;
  className?: string;
  disabled?: boolean;
  maxHeight?: number;
  id?: string;
}

export default function ReusableCombobox({
  options,
  selectedValue,
  placeholder = 'Seçim yapın',
  onSelect,
  className = '',
  disabled = false,
  maxHeight = 200,
  id
}: ReusableComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const comboboxRef = useRef<HTMLDivElement>(null);

  // Dışarı tıklandığında dropdown'ı kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Eğer tıklanan element combobox veya dropdown içinde değilse, dropdown'ı kapat
      if (!target.closest('[data-combobox]') && !target.closest('[data-dropdown]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Seçim yapıldığında
  const handleOptionSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  // Dropdown toggle fonksiyonu
  const toggleDropdown = () => {
    if (disabled) return;

    const isOpening = !isOpen;

    if (isOpening) {
      // Dropdown açılırken pozisyonu hesapla
      const comboboxElement = comboboxRef.current;
      if (comboboxElement) {
        const rect = comboboxElement.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        });
      }
    }

    setIsOpen(isOpening);
  };

  // Seçili option'ı bul
  const selectedOption = options.find(option => option.value === selectedValue);

  return (
    <>
      {/* Combobox */}
      <div 
        className={`${styles.comboboxContainer} ${className}`} 
        data-combobox
        id={id}
      >
        <div
          ref={comboboxRef}
          onClick={toggleDropdown}
          className={`${styles.combobox} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
        >
          <span className={styles.comboboxText}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className={`${styles.comboboxArrow} ${isOpen ? styles.open : ''}`}>
            ▼
          </span>
        </div>
      </div>

      {/* Dropdown Portal */}
      {isOpen && dropdownPosition && createPortal(
        <div
          data-dropdown
          className={styles.dropdown}
          style={{
            position: 'absolute',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            maxHeight: maxHeight
          }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionSelect(option.value)}
              className={`${styles.dropdownItem} ${
                selectedValue === option.value ? styles.selected : ''
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
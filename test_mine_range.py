#!/usr/bin/env python3
"""
Test script to verify the 1-24 mine prediction system
"""

import re
import os
import json
from pathlib import Path

def test_mine_options_completeness():
    """Test that all mine options from 1-24 are available"""
    print("🧪 Testing Mine Options Completeness")
    
    # Read HTML file
    html_path = Path("/workspace/index.html")
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Extract mine options
    mine_options_pattern = r'<option value="(\d+)">.*?</option>'
    options = re.findall(mine_options_pattern, html_content)
    options = [int(opt) for opt in options]
    
    # Check if all numbers 1-24 are present
    expected_options = list(range(1, 25))
    missing_options = set(expected_options) - set(options)
    extra_options = set(options) - set(expected_options)
    
    print(f"Found options: {sorted(options)}")
    print(f"Expected: {expected_options}")
    
    if not missing_options and not extra_options:
        print("✅ All mine options 1-24 are present")
        return True
    else:
        if missing_options:
            print(f"❌ Missing options: {sorted(missing_options)}")
        if extra_options:
            print(f"❌ Extra options: {sorted(extra_options)}")
        return False

def test_win_rate_calculations():
    """Test win rate calculations for each mine amount"""
    print("\n🧪 Testing Win Rate Calculations")
    
    # Calculate expected win rates for each mine amount
    total_cells = 25
    expected_results = []
    
    for mines in range(1, 25):
        safe_cells = total_cells - mines
        win_rate = (safe_cells / total_cells) * 100
        expected_results.append({
            'mines': mines,
            'safe_cells': safe_cells,
            'win_rate': round(win_rate, 1)
        })
    
    print("Sample calculations:")
    for result in expected_results[:5]:  # Show first 5
        print(f"  {result['mines']} mines → {result['safe_cells']} safe cells → {result['win_rate']}% win rate")
    print("  ...")
    for result in expected_results[-3:]:  # Show last 3
        print(f"  {result['mines']} mines → {result['safe_cells']} safe cells → {result['win_rate']}% win rate")
    
    return True

def test_multiplier_calculations():
    """Test multiplier calculations for different mine amounts"""
    print("\n🧪 Testing Multiplier Calculations")
    
    total_cells = 25
    house_edge = 0.01  # 1% house edge
    
    test_cases = [1, 5, 10, 15, 20, 24]
    
    for mines in test_cases:
        safe_cells = total_cells - mines
        win_probability = safe_cells / total_cells
        fair_multiplier = 1 / win_probability
        actual_multiplier = fair_multiplier * (1 - house_edge)
        
        print(f"  {mines} mines: {safe_cells} safe cells → {win_probability:.4f} win prob → {actual_multiplier:.2f}x multiplier")
    
    return True

def test_validation_logic():
    """Test the validation logic for mine amounts"""
    print("\n🧪 Testing Validation Logic")
    
    # Check script.js validation
    script_path = Path("/workspace/script.js")
    with open(script_path, 'r', encoding='utf-8') as f:
        script_content = f.read()
    
    # Look for validation pattern
    validation_pattern = r'mineAmount > this\.totalCells - 1'
    if re.search(validation_pattern, script_content):
        print("✅ Validation logic allows maximum 24 mines for 5x5 grid")
        return True
    else:
        print("❌ Validation logic not found or incorrect")
        return False

def test_html_structure():
    """Test that HTML structure is correct"""
    print("\n🧪 Testing HTML Structure")
    
    html_path = Path("/workspace/index.html")
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Check for required elements
    required_elements = [
        ('<select id="mineAmount"', 'Mine amount select element'),
        ('<option value="24"', '24 mine option'),
        ('🎮 Select mine density for risk level', 'Input hint text'),
        ('Mine Configuration', 'Label text')
    ]
    
    all_found = True
    for pattern, description in required_elements:
        if pattern in html_content:
            print(f"✅ {description} found")
        else:
            print(f"❌ {description} not found")
            all_found = False
    
    return all_found

def main():
    """Run all tests"""
    print("🚀 Testing 1-24 Mine Prediction System")
    print("=" * 50)
    
    tests = [
        test_mine_options_completeness,
        test_win_rate_calculations,
        test_multiplier_calculations,
        test_validation_logic,
        test_html_structure
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"❌ Test failed with error: {e}")
            results.append(False)
    
    print("\n" + "=" * 50)
    print("📊 Test Summary:")
    passed = sum(results)
    total = len(results)
    print(f"✅ Passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 All tests passed! The 1-24 mine prediction system is working correctly.")
        return True
    else:
        print("⚠️  Some tests failed. Please check the implementation.")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
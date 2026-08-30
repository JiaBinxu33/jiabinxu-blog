#!/usr/bin/env python3
"""
Skill 打包工具 - 将 skill 目录打包为可分发的 .skill 文件

用法:
    python utils/package_skill.py <path/to/skill-folder> [output-directory]

示例:
    python utils/package_skill.py skills/public/my-skill
    python utils/package_skill.py skills/public/my-skill ./dist
"""

import sys
import zipfile
from pathlib import Path

from quick_validate import validate_skill


def package_skill(skill_path, output_dir=None):
    """
    将一个 skill 目录打包为 .skill 文件。

    参数:
        skill_path: skill 目录路径
        output_dir: 可选，.skill 文件的输出目录（默认当前目录）

    返回:
        创建成功的 .skill 文件路径；出错时返回 None
    """
    skill_path = Path(skill_path).resolve()

    # 校验 skill 目录是否存在
    if not skill_path.exists():
        print(f"[ERROR] 未找到 skill 目录: {skill_path}")
        return None

    if not skill_path.is_dir():
        print(f"[ERROR] 路径不是目录: {skill_path}")
        return None

    # 校验 SKILL.md 是否存在
    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        print(f"[ERROR] 在 {skill_path} 中未找到 SKILL.md")
        return None

    # 打包前先进行校验
    print("正在校验 skill...")
    valid, message = validate_skill(skill_path)
    if not valid:
        print(f"[ERROR] 校验失败: {message}")
        print("   请先修复上述校验错误后再进行打包。")
        return None
    print(f"[OK] {message}\n")

    # 确定输出目录
    skill_name = skill_path.name
    if output_dir:
        output_path = Path(output_dir).resolve()
        output_path.mkdir(parents=True, exist_ok=True)
    else:
        output_path = Path.cwd()

    skill_filename = output_path / f"{skill_name}.skill"

    # 创建 .skill 文件（zip 格式）
    try:
        with zipfile.ZipFile(skill_filename, "w", zipfile.ZIP_DEFLATED) as zipf:
            # 遍历 skill 目录
            for file_path in skill_path.rglob("*"):
                if file_path.is_file():
                    # 计算在压缩包中的相对路径
                    arcname = file_path.relative_to(skill_path.parent)
                    zipf.write(file_path, arcname)
                    print(f"  已添加: {arcname}")

        print(f"\n[OK] 已成功打包 skill 文件: {skill_filename}")
        return skill_filename

    except Exception as e:
        print(f"[ERROR] 创建 .skill 文件失败: {e}")
        return None


def main():
    if len(sys.argv) < 2:
        print("用法: python utils/package_skill.py <path/to/skill-folder> [output-directory]")
        print("\n示例:")
        print("  python utils/package_skill.py skills/public/my-skill")
        print("  python utils/package_skill.py skills/public/my-skill ./dist")
        sys.exit(1)

    skill_path = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else None

    print(f"开始打包 skill: {skill_path}")
    if output_dir:
        print(f"   输出目录: {output_dir}")
    print()

    result = package_skill(skill_path, output_dir)

    if result:
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
